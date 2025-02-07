use jsonwebtoken::{decode, DecodingKey, Validation, TokenData};
use serde::{Deserialize, Serialize};
use std::env;
use chrono::{Utc, Duration};
use jsonwebtoken::errors::Error as JwtError;

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,  // User ID (private field)
    pub exp: usize,   // Expiration time
}

// Generates a JWT token for a given user ID
pub fn generate_jwt(user_id: &str) -> Result<String, JwtError> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration,
    };

    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    jsonwebtoken::encode(&jsonwebtoken::Header::default(), &claims, &jsonwebtoken::EncodingKey::from_secret(secret.as_ref()))
}

// Decodes a JWT token and returns the claims
pub fn decode_jwt(token: &str) -> Result<TokenData<Claims>, JwtError> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    // Validation is needed to ensure the token is valid
    let validation = Validation::default();
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )
}