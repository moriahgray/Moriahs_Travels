use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;
use crate::utils::keyring;

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

// Initializes the database connection pool with improved error handling
pub fn init_pool() -> DbPool {
    // Retrieve database password securely from the keyring
    let password = keyring::get_password();

    // Construct the database URL dynamically
    let database_url_template = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://root:PLACEHOLDER@database:3306/moriahsTravels".to_string());
    
    // Replace PLACEHOLDER with the actual password from the keyring
    let database_url = database_url_template.replace("PLACEHOLDER", &password);

    // Initialize the connection manager
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    r2d2::Pool::builder()
        .max_size(15) // Increased pool size for better performance
        .build(manager)
        .expect("Failed to create database pool")
}