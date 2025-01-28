use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;
use std::fs;

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

pub fn init_pool() -> DbPool {
    // Retrieve database password securely from Docker secret
    let password = get_password_from_secret();

    // Construct the database URL dynamically
    let database_url_template = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://root:PLACEHOLDER@database:3306/moriahsTravels".to_string());

    // Replace PLACEHOLDER with the actual password retrieved from the secret
    let database_url = database_url_template.replace("PLACEHOLDER", &password);

    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    r2d2::Pool::builder()
        .max_size(15)  // Adjust pool size as needed
        .build(manager)
        .expect("Failed to create database pool")
}

/// Reads the database password from Docker secret
fn get_password_from_secret() -> String {
    let secret_path = "/run/secrets/database_password";  // Path where Docker Swarm injects secrets

    // Read the password from the secret file
    match fs::read_to_string(secret_path) {
        Ok(password) => password.trim().to_string(),
        Err(_) => {
            eprintln!("Failed to retrieve password from Docker secret.");
            std::process::exit(1);  // Exit if the password retrieval fails
        }
    }
}