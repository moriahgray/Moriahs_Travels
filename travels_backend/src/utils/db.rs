use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;
use dotenvy::dotenv;
use std::{fs, env, thread, time::Duration};

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

pub fn init_pool() -> DbPool {
    dotenv().ok(); // Load environment variables

    let password = get_database_password();

    let database_url_template = env::var("DATABASE_URL").unwrap_or_else(|_| {
        eprintln!("❌ DATABASE_URL is missing or empty!");
        std::process::exit(1);
    });

    println!("🔹 Original DATABASE_URL: '{}'", database_url_template);
    println!("🔹 Retrieved Password: '{}'", password);

    // Debug: Ensure DATABASE_URL contains "PLACEHOLDER"
    if !database_url_template.contains("PLACEHOLDER") {
        eprintln!("❌ DATABASE_URL does NOT contain 'PLACEHOLDER'! Possible issue in environment variables.");
        std::process::exit(1);
    }

    let database_url = database_url_template.replace("PLACEHOLDER", &password);

    if database_url.is_empty() {
        eprintln!("❌ Final DATABASE_URL is EMPTY after replacement!");
        std::process::exit(1);
    }

    println!("🔹 Final DATABASE_URL: '{}'", database_url);

    for attempt in 1..=5 {
        let manager = ConnectionManager::<MysqlConnection>::new(database_url.clone());

        match r2d2::Pool::builder().max_size(15).build(manager) {
            Ok(pool) => {
                println!("✅ Database pool created successfully!");
                return pool;
            }
            Err(e) => {
                eprintln!("❌ Attempt {} - Failed to create pool: {}", attempt, e);
                thread::sleep(Duration::from_secs(5));
            }
        }
    }

    panic!("❌ All attempts failed! Could not create database pool.");
}

// Reads the database password from Docker secret or falls back to an environment variable
fn get_database_password() -> String {
    let secret_path = "/run/secrets/database_password";

    if let Ok(password) = fs::read_to_string(secret_path) {
        let trimmed_password = password.trim().to_string();
        println!("🔹 Read password from secret file: '{}'", trimmed_password);
        return trimmed_password;
    }

    // Fallback to environment variable if the secret is missing
    match env::var("DATABASE_PASSWORD") {
        Ok(password) => {
            println!("🔹 Read password from environment variable: '{}'", password);
            password
        }
        Err(_) => {
            eprintln!("❌ Failed to retrieve password from Docker secret and environment variable");
            std::process::exit(1);
        }
    }
}