use actix_web::{web, post, get, HttpResponse, Responder};
use diesel::prelude::*;
use crate::models::{User, NewUser};
use crate::schema::users::dsl::*;
use crate::utils::db::DbPool;
use crate::utils::jwt::{generate_jwt, decode_jwt};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use argon2::password_hash::{SaltString, PasswordHasher};
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use log::{info, error};

#[derive(Deserialize, Serialize, Debug)] 
pub struct RegisterUser {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[post("/auth/register")]
pub async fn register_user(
    pool: web::Data<DbPool>,
    item: web::Json<RegisterUser>,
) -> impl Responder {
    info!("Received registration request: {:?}", item);

    let mut conn = pool.get().expect("Failed to get DB connection");

    // Generate UUID for uuid_user_id
    let generated_uuid_user_id = Uuid::new_v4().to_string();

    // Hash the password using Argon2
    let salt = SaltString::generate(&mut rand::thread_rng());
    let hashed_password = Argon2::default()
        .hash_password(item.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let new_user = NewUser {
        user_id: item.first_name.clone(),
        uuid_user_id: Some(generated_uuid_user_id.clone()), // Clone so we can use it later
        first_name: item.first_name.clone(),
        last_name: item.last_name.clone(),
        email: item.email.clone(),
        password: hashed_password,
    };

    info!("Inserting new user into the database: {:?}", new_user);

    match diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn) 
    {
        Ok(_) => {
            info!("User created successfully.");
            HttpResponse::Created()
                .content_type("application/json")
                .json(serde_json::json!({ 
                    "message": "User created successfully", 
                    "uuid": generated_uuid_user_id // Now safely available
                }))
        }
        Err(e) => {
            error!("Error inserting new user: {:?}", e);
            HttpResponse::InternalServerError().body("Error creating user")
        }
    }
}

#[post("/auth/login")]
pub async fn login_user(
    pool: web::Data<DbPool>,
    item: web::Json<LoginUser>,
) -> impl Responder {
    info!("Received login request: {:?}", item);

    let mut conn = pool.get().expect("Failed to get DB connection");

    let user: User = match users
        .filter(email.eq(&item.email))
        .first(&mut conn) 
    {
        Ok(user) => user,
        Err(e) => {
            error!("Error fetching user for email {}: {:?}", item.email, e);
            return HttpResponse::Unauthorized().body("Invalid credentials");
        }
    };

    info!("Verifying password for user: {}", item.email);

    let password_matches = if let Some(stored_password) = &user.password {
        Argon2::default()
            .verify_password(item.password.as_bytes(), &PasswordHash::new(stored_password).unwrap())
            .is_ok()
    } else {
        false
    };

    if !password_matches {
        error!("Password mismatch for user: {}", item.email);
        return HttpResponse::Unauthorized().body("Invalid credentials");
    }

    // Clone `uuid_user_id` before using it multiple times
    let user_uuid = user.uuid_user_id.clone().unwrap_or_default();

    // Generate JWT token using UUID
    let token: String = match generate_jwt(&user_uuid) {
        Ok(token) => {
            info!("Generated JWT token successfully.");
            token
        }
        Err(_) => {
            error!("Error generating JWT token.");
            return HttpResponse::InternalServerError().body("Error generating JWT");
        }
    };

    info!("Returning JWT token");

    HttpResponse::Ok().json(serde_json::json!({
        "message": "Login successful",
        "token": token,
        "uuid_user_id": user_uuid // UUID safely available here
    }))
}

#[derive(Serialize)]
pub struct VerifyAuthResponse {
    pub message: String,
}

#[get("/auth/verify")]
pub async fn verify_auth(auth_header: Option<String>) -> impl Responder {
    let token = auth_header.unwrap_or_default();

    if token.is_empty() {
        error!("No token provided.");
        return HttpResponse::BadRequest().json(VerifyAuthResponse {
            message: "No token provided".to_string(),
        });
    }

    info!("Received token for verification");

    match decode_jwt(&token) {
        Ok(_) => {
            info!("Token is valid.");
            HttpResponse::Ok().json(VerifyAuthResponse {
                message: "Token valid".to_string(),
            })
        }
        Err(e) => {
            error!("Invalid token: {:?}", e);
            HttpResponse::Unauthorized().json(VerifyAuthResponse {
                message: "Invalid token".to_string(),
            })
        }
    }
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(register_user)
        .service(login_user)
        .service(verify_auth);
}