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

#[derive(Deserialize, Serialize)] 
pub struct RegisterUser {
    pub user_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[post("/auth/register")]
pub async fn register_user(
    pool: web::Data<DbPool>,
    item: web::Json<RegisterUser>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");

    // Generate user_id from first 3 characters of first_name and last_name
    let generated_user_id = format!(
        "{}{}", 
        &item.first_name[0..3], 
        &item.last_name[0..3]
    ).to_lowercase();

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

    // Insert new user into the database
    diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn)
        .expect("Error inserting new user");

    // Return success message as a JSON response
    HttpResponse::Created()
        .content_type("application/json")
        .json(serde_json::json!({ "message": "User created successfully" }))
}

#[post("/auth/login")]
pub async fn login_user(
    pool: web::Data<DbPool>,
    item: web::Json<LoginUser>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get DB connection");

    // Fetch user based on the email
    let user: User = users
        .filter(email.eq(&item.email))
        .first(&mut conn)
        .expect("Error fetching user");

    // Verify password
    let password_matches = if let Some(stored_password) = &user.password {
        Argon2::default()
            .verify_password(item.password.as_bytes(), &PasswordHash::new(stored_password).unwrap())
            .is_ok()
    } else {
        false
    };

    // If password doesn't match, return Unauthorized response
    if !password_matches {
        return HttpResponse::Unauthorized().body("Invalid credentials");
    }

    // Generate a JWT token
    let token: String = match generate_jwt(&user.uuid_user_id.unwrap_or_default()) {
        Ok(token) => token,
        Err(_) => return HttpResponse::InternalServerError().body("Error generating JWT"),
    };

    // Return the JWT token as a JSON response
    HttpResponse::Ok().json(token)
}

#[derive(Serialize)]
pub struct VerifyAuthResponse {
    pub message: String,
}

#[get("/auth/verify")]
pub async fn verify_auth(auth_header: Option<String>) -> impl Responder {
    let token = auth_header.unwrap_or_default();
    let decoded_token = decode_jwt(&token);

    match decoded_token {
        Ok(_) => HttpResponse::Ok().json(VerifyAuthResponse {
            message: "Token valid".to_string(),
        }),
        Err(_) => HttpResponse::Unauthorized().json(VerifyAuthResponse {
            message: "Invalid token".to_string(),
        }),
    }
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(register_user)
        .service(login_user)
        .service(verify_auth);
}