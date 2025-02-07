use actix_web::{get, post, web, HttpResponse, Responder};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::{User, NewUser};
use crate::schema::users::dsl::*;
use crate::utils::db::DbPool;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;
use actix_web::http::header::AUTHORIZATION;
use uuid::Uuid; // Import UUID crate

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,  // User ID (private field)
    exp: usize,   // Expiration time
}

impl Claims {
    // Getter for the sub field
    pub fn sub(&self) -> &str {
        &self.sub
    }
}

#[derive(Deserialize)]
pub struct SignupRequest {
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

// Sign-up endpoint to create a new user
#[post("/signup")]
pub async fn signup(
    pool: web::Data<DbPool>,
    user_data: web::Json<SignupRequest>,
) -> impl Responder {
    let mut conn = match pool.get() {
        Ok(conn) => conn,
        Err(e) => return HttpResponse::InternalServerError().body(format!("Database connection error: {}", e)),
    };

    // Generate UUID for user ID
    let user_id = Uuid::new_v4().to_string(); // Generate a random UUID for the user ID

    // Generate a salted hash for the password
    let salt = SaltString::generate(&mut rand::thread_rng());
    let hashed_password = match Argon2::default().hash_password(user_data.password.as_bytes(), &salt) {
        Ok(hash) => hash.to_string(),
        Err(_) => return HttpResponse::InternalServerError().body("Password hashing failed"),
    };

    // Create a new user struct with the generated user_id
    let new_user = NewUser {
        user_id,  // Use the generated user_id
        first_name: user_data.first_name.clone(),
        last_name: user_data.last_name.clone(),
        email: user_data.email.clone(),
        password: hashed_password,
    };

    // Insert new user into the database
    match diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut conn) {
        Ok(_) => (),
        Err(err) => return HttpResponse::InternalServerError().body(format!("Failed to create user: {}", err)),
    }

    // Generate JWT token for the new user
    let token = match generate_jwt(&new_user.user_id) {
        Ok(token) => token,
        Err(_) => return HttpResponse::InternalServerError().body("JWT generation failed"),
    };

    // Return response with success message and token
    HttpResponse::Created().json(serde_json::json!({
        "message": "User created successfully",
        "token": token
    }))
}

// Login endpoint to authenticate a user
#[post("/login")]
pub async fn login(
    pool: web::Data<DbPool>,
    credentials: web::Json<LoginRequest>,
) -> impl Responder {
    let mut conn = match pool.get() {
        Ok(conn) => conn,
        Err(_) => return HttpResponse::InternalServerError().body("Database connection error"),
    };

    // Query the database to find the user with the provided email
    let user_result = match users.filter(email.eq(&credentials.email))
        .load::<User>(&mut conn) {
        Ok(user) => user,
        Err(_) => return HttpResponse::InternalServerError().body("Failed to query user"),
    };

    let user = match user_result.into_iter().next() {
        Some(user) => user,
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid email or password"
        })),
    };

    // Validate the password hash
    let parsed_hash = match PasswordHash::new(&user.password) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().body("Invalid stored password hash"),
    };

    let is_valid = Argon2::default()
        .verify_password(credentials.password.as_bytes(), &parsed_hash)
        .is_ok();

    if !is_valid {
        return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid email or password"
        }));
    }

    // Generate JWT token after successful login
    let token = match generate_jwt(&user.user_id) {
        Ok(token) => token,
        Err(_) => return HttpResponse::InternalServerError().body("JWT generation failed"),
    };

    // Return response with success message and token
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Login successful",
        "token": token
    }))
}

// Verify the token using JWT
#[get("/auth/verify")]
pub async fn verify_auth(auth_header: web::HeaderMap) -> impl Responder {
    // Extract the 'Authorization' header from the HeaderMap
    let token = match auth_header.get(AUTHORIZATION) {
        Some(header_value) => header_value.to_str().unwrap_or("").replace("Bearer ", ""),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Authorization token missing"
        })),
    };

    // Decode and verify the JWT token
    match decode_jwt(&token) {
        Ok(decoded_token) => HttpResponse::Ok().json(serde_json::json!({
            "message": "Token is valid",
            "user_id": decoded_token.claims.sub() // Using the getter method for sub
        })),
        Err(_) => HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid or expired token"
        })),
    }
}

// Function to generate JWT token
pub fn generate_jwt(user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration,
    };

    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
}

// Function to decode and verify JWT token
pub fn decode_jwt(token: &str) -> Result<jsonwebtoken::TokenData<Claims>, jsonwebtoken::errors::Error> {
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let validation = Validation::default();
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )
}

// Register routes with Actix Web
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(signup)
        .service(login)
        .service(verify_auth);
}