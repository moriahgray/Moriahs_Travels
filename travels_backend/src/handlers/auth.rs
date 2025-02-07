use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use crate::models::{User, NewUser};
use crate::schema::users::dsl::*;
use crate::utils::db::DbPool;
use crate::utils::jwt::{generate_jwt, decode_jwt};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;
use actix_web::http::header::{HeaderMap, AUTHORIZATION};
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
    let conn = pool.get().expect("Failed to get DB connection");

    let hashed_password = argon2::hash_encoded(item.password.as_bytes(), SaltString::generate(&mut rand::thread_rng()).as_bytes(), &argon2::Config::default())
        .unwrap();

    let uuid_user_id = Uuid::new_v4().to_string(); // Generate UUID for user_id

    let new_user = NewUser {
        user_id: uuid_user_id.clone(),
        uuid_user_id: Some(uuid_user_id),
        first_name: item.first_name.clone(),
        last_name: item.last_name.clone(),
        email: item.email.clone(),
        password: hashed_password,
    };

    diesel::insert_into(users)
        .values(&new_user)
        .execute(&conn)
        .expect("Error inserting new user");

    HttpResponse::Created().body("User created successfully")
}

#[post("/auth/login")]
pub async fn login_user(
    pool: web::Data<DbPool>,
    item: web::Json<LoginUser>,
) -> impl Responder {
    let conn = pool.get().expect("Failed to get DB connection");

    let user: User = users
        .filter(email.eq(&item.email))
        .first(&conn)
        .expect("Error fetching user");

    let password_matches = Argon2::default()
        .verify_password(item.password.as_bytes(), &PasswordHash::new(&user.password).unwrap())
        .is_ok();

    if !password_matches {
        return HttpResponse::Unauthorized().body("Invalid credentials");
    }

    let token = match generate_jwt(user.uuid_user_id.unwrap_or_default()) {
        Ok(token) => token,
        Err(_) => return HttpResponse::InternalServerError().body("Error generating JWT"),
    };

    HttpResponse::Ok().json(token)
}

#[get("/auth/verify")]
pub async fn verify_auth(auth_header: HeaderMap) -> impl Responder {
    let token = auth_header.get(AUTHORIZATION).and_then(|h| h.to_str().ok()).unwrap_or_default();

    let decoded_token = decode_jwt(token);

    match decoded_token {
        Ok(_) => HttpResponse::Ok().body("Token valid"),
        Err(_) => HttpResponse::Unauthorized().body("Invalid token"),
    }
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(register_user)
        .service(login_user)
        .service(verify_auth);
}