use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use serde::Deserialize;
use crate::models::{User, NewUser};
use crate::schema::users::dsl::*;
use crate::utils::db::DbPool;
use crate::utils::jwt::generate_jwt;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;
use rand::Rng;

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
) -> impl Responder {
    let mut conn = pool.get()
        .map_err(|_| HttpResponse::InternalServerError().json(serde_json::json!({ "error": "Database connection error" })))?;

    // Hash the password
    let salt = SaltString::generate(&mut thread_rng());
    let hashed_password = match Argon2::default().hash_password(user_data.password.as_bytes(), &salt) {
        Ok(hash) => hash.to_string(),
        Err(_) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({ "error": "Password hashing failed" }));
        }
    };

    // Create a new user
    let new_user = NewUser {
        user_id: user_data.user_id.clone(),
        first_name: user_data.first_name.clone(),
        last_name: user_data.last_name.clone(),
        email: user_data.email.clone(),
        password: hashed_password,
    };

    // Insert user into the database
    if let Err(err) = diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn)
    {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create user: {}", err)
        }));
    }

    // Generate JWT token
    let token = match generate_jwt(&new_user.user_id) {
        Ok(token) => token,
        Err(_) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({ "error": "JWT generation failed" }));
        }
    };

    HttpResponse::Created().json(serde_json::json!({
        "message": "User created successfully",
        "token": token
    }))
}

pub async fn login(
    pool: web::Data<DbPool>,
    credentials: web::Json<LoginRequest>,
) -> impl Responder {
    let mut conn = pool.get()
        .map_err(|_| HttpResponse::InternalServerError().json(serde_json::json!({ "error": "Database connection error" })))?;

    // Retrieve user from the database
    let user = match users.filter(email.eq(&credentials.email))
        .first::<User>(&mut conn)
        .optional()
    {
        Ok(Some(user)) => user,
        Ok(None) => {
            return HttpResponse::Unauthorized().json(serde_json::json!({ "error": "Invalid email or password" }));
        }
        Err(_) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({ "error": "Failed to query user" }));
        }
    };

    // Verify the password
    let is_valid = Argon2::default()
        .verify_password(credentials.password.as_bytes(), &PasswordHash::new(&user.password).unwrap())
        .unwrap_or(false);

    if !is_valid {
        return HttpResponse::Unauthorized().json(serde_json::json!({ "error": "Invalid email or password" }));
    }

    // Generate JWT token
    let token = match generate_jwt(&user.user_id) {
        Ok(token) => token,
        Err(_) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({ "error": "JWT generation failed" }));
        }
    };

    HttpResponse::Ok().json(serde_json::json!({
        "message": "Login successful",
        "token": token
    }))
}