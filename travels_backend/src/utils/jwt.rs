use jsonwebtoken::{decode, DecodingKey, Validation, TokenData, encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use std::env;
use chrono::{Utc, Duration};
use jsonwebtoken::errors::Error as JwtError;

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub sub: String,
    pub first_name: String,
    pub exp: usize,
}

// Generates a JWT token for a given user ID **and first name**
pub fn generate_jwt(user_id: &str, first_name: &str) -> Result<String, JwtError> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        first_name: first_name.to_owned(),
        exp: expiration,
    };

    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
}

// Decodes a JWT token and returns the claims
pub fn decode_jwt(token: &str) -> Result<TokenData<Claims>, JwtError> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    let validation = Validation::default();
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )
}