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
    pub first_name: String, // first_name will be the user_id now
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
    use log::{info, error};

    info!("Received registration request: {:?}", item);

    let mut conn = pool.get().expect("Failed to get DB connection");

    // Use first_name as user_id
    let generated_user_id = item.first_name.clone();

    // Generate UUID for uuid_user_id
    let generated_uuid_user_id = Uuid::new_v4().to_string();

    // Hash the password using Argon2
    let salt = SaltString::generate(&mut rand::thread_rng());
    let hashed_password = Argon2::default()
        .hash_password(item.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let new_user = NewUser {
        user_id: generated_user_id,
        uuid_user_id: Some(generated_uuid_user_id),
        first_name: item.first_name.clone(),
        last_name: item.last_name.clone(),
        email: item.email.clone(),
        password: hashed_password,
    };

    // Log user information before inserting into the database
    info!("Inserting new user into the database: {:?}", new_user);

    match diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn) 
    {
        Ok(_) => {
            info!("User created successfully.");
            HttpResponse::Created()
                .content_type("application/json")
                .json(serde_json::json!({ "message": "User created successfully" }))
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
    use log::{info, error};

    info!("Received login request: {:?}", item);

    let mut conn = pool.get().expect("Failed to get DB connection");

    // Fetch user based on the email
    let user: User = match users
        .filter(email.eq(&item.email))
        .first(&mut conn) 
    {
        Ok(user) => user,
        Err(e) => {
            error!("Error fetching user: {:?}", e);
            return HttpResponse::Unauthorized().body("Invalid credentials");
        }
    };

    // Log user password verification attempt
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

    // Generate JWT token
    let token: String = match generate_jwt(&user.uuid_user_id.unwrap_or_default()) {
        Ok(token) => {
            info!("Generated JWT token successfully.");
            token
        }
        Err(_) => {
            error!("Error generating JWT token.");
            return HttpResponse::InternalServerError().body("Error generating JWT");
        }
    };

    // Log the token (consider masking sensitive parts in production)
    info!("Returning JWT token: {}", token);

    HttpResponse::Ok().json(token)
}

#[derive(Serialize)]
pub struct VerifyAuthResponse {
    pub message: String,
}

#[get("/auth/verify")]
pub async fn verify_auth(auth_header: Option<String>) -> impl Responder {
    use log::{info, error};

    let token = auth_header.unwrap_or_default();
    info!("Received token for verification: {}", token);

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