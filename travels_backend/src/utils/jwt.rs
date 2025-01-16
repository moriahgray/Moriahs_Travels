use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Serialize};

#[derive(Serialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub fn generate_jwt(user_id: &str) -> String {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::days(7))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims { sub: user_id.to_owned(), exp: expiration };
    let key = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    encode(&Header::default(), &claims, &EncodingKey::from_secret(key.as_ref()))
        .expect("Token creation failed")
}