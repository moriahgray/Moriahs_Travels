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

#[derive(Deserialize)]
pub struct RegisterUser {
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
    let _conn = pool.get().expect("Failed to get DB connection");

    // Fix for hash_encoded usage
    let salt = SaltString::generate(&mut rand::thread_rng());
    let hashed_password = Argon2::default()
        .hash_password(item.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let generated_uuid = Uuid::new_v4().to_string();

    let new_user = NewUser {
        user_id: generated_uuid.clone(),
        uuid_user_id: Some(generated_uuid),
        first_name: item.first_name.clone(),
        last_name: item.last_name.clone(),
        email: item.email.clone(),
        password: hashed_password,
    };

    let mut conn = pool.get().expect("Failed to get DB connection");

    diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn)
        .expect("Error inserting new user");

    HttpResponse::Created().body("User created successfully")
}

#[post("/auth/login")]
pub async fn login_user(
    pool: web::Data<DbPool>,
    item: web::Json<LoginUser>,
) -> impl Responder {
    // Get the connection from the pool
    let conn = &mut pool.get().expect("Failed to get DB connection");

    // Fetch the user from the database based on the email
    let user: User = users
        .filter(email.eq(&item.email)) 
        .first(conn)
        .expect("Error fetching user");

    // Check if the provided password matches the stored hashed password
    let password_matches = if let Some(stored_password) = &user.password {
        Argon2::default()
            .verify_password(item.password.as_bytes(), &PasswordHash::new(stored_password).unwrap())
            .is_ok()
    } else {
        false // Handle the case where password is None
    };
    

    // If the password doesn't match, return Unauthorized response
    if !password_matches {
        return HttpResponse::Unauthorized().body("Invalid credentials");
    }

    // Generate a JWT token using the user's UUID (or a default if missing)
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
    // Check if the Authorization header exists and extract the token
    let token = auth_header.unwrap_or_default();

    // Decode the JWT token
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