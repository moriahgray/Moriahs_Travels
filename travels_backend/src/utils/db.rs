use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;
use std::env;
use crate::utils::keyring;


pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

// Initializes the database connection pool with improved error handling
pub fn init_pool() -> DbPool {
    // Retrieve database password securely from the keyring or fallback to environment variable
    let password = if let Ok(password) = env::var("DATABASE_PASSWORD") {
        password
    } else {
        keyring::get_password()
    };

    // Construct the database URL dynamically
    let database_url_template = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let database_url = database_url_template.replace("PLACEHOLDER", &password);

    // Initialize the connection manager
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    r2d2::Pool::builder()
        .max_size(15) // Increased pool size for better performance
        .build(manager)
        .expect("Failed to create database pool")
}