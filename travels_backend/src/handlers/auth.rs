use actix_web::{web, HttpResponse};
use diesel::prelude::*;
use serde::Deserialize;
use crate::models::{User, NewUser};
use crate::schema::users::dsl::*;
use crate::utils::db::DbPool;
use crate::utils::jwt::generate_jwt;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;

#[derive(Deserialize)]
pub struct SignupRequest {
    pub user_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

pub async fn signup(
    pool: web::Data<DbPool>,
    user_data: web::Json<SignupRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get()
        .map_err(|_| {
            actix_web::error::ErrorInternalServerError("Database connection error")
        })?;

    // Hash the password
    let salt = SaltString::generate(&mut rand::thread_rng());
    let hashed_password = Argon2::default()
        .hash_password(user_data.password.as_bytes(), &salt)
        .map_err(|_| {
            actix_web::error::ErrorInternalServerError("Password hashing failed")
        })?
        .to_string();

    // Create a new user
    let new_user = NewUser {
        user_id: user_data.user_id.clone(),
        first_name: user_data.first_name.clone(),
        last_name: user_data.last_name.clone(),
        email: user_data.email.clone(),
        password: hashed_password,
    };

    // Insert user into the database
    diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to create user: {}", err))
        })?;

    // Generate JWT token
    let token = generate_jwt(&new_user.user_id).map_err(|_| {
        actix_web::error::ErrorInternalServerError("JWT generation failed")
    })?;

    Ok(HttpResponse::Created().json(serde_json::json!({
        "message": "User created successfully",
        "token": token
    })))
}

pub async fn login(
    pool: web::Data<DbPool>,
    credentials: web::Json<LoginRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get()
        .map_err(|_| {
            actix_web::error::ErrorInternalServerError("Database connection error")
        })?;

    // Retrieve user from the database
    let user_result = users
        .filter(email.eq(&credentials.email))
        .load::<User>(&mut conn) // Use `load` to retrieve the matching rows
        .map_err(|_| {
            actix_web::error::ErrorInternalServerError("Failed to query user")
        })?;

    // Ensure at least one matching user exists
    let user = match user_result.into_iter().next() {
        Some(user) => user,
        None => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid email or password"
            })));
        }
    };

    // Verify the password
    let is_valid = Argon2::default()
        .verify_password(
            credentials.password.as_bytes(),
            &PasswordHash::new(&user.password).unwrap(),
        )
        .is_ok();

    if !is_valid {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid email or password"
        })));
    }

    // Generate JWT token
    let token = generate_jwt(&user.user_id).map_err(|_| {
        actix_web::error::ErrorInternalServerError("JWT generation failed")
    })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Login successful",
        "token": token
    })))
}
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/signup").route(web::post().to(signup)))
        .service(web::resource("/login").route(web::post().to(login)));
}