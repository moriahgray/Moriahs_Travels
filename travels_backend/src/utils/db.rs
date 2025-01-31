use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;
use std::{fs, env, thread, time::Duration};

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

pub fn init_pool() -> DbPool {
    // Retrieve database password securely from Docker secret
    let password = get_database_password();

    // Retrieve the database URL template from environment variables
    let database_url_template = env::var("DATABASE_URL")
        .unwrap_or_else(|_| {
            eprintln!("❌ DATABASE_URL environment variable is missing!");
            std::process::exit(1);
        });

    // Replace the placeholder with the actual password retrieved from the secret
    let database_url = database_url_template.replace("PLACEHOLDER", &password);

    println!("🔹 Final DATABASE_URL: {}", database_url);

    // Retry logic to handle possible database startup delays
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

// Reads the database password from Docker secret or falls back to .env
fn get_database_password() -> String {
    let secret_path = "/run/secrets/database_password";
    if let Ok(password) = fs::read_to_string(secret_path) {
        let trimmed_password = password.trim().to_string();
        println!("🔹 Read password from secret: '{}'", trimmed_password);
        return trimmed_password;
    }

    // Fallback to environment variable if the secret is missing
    env::var("DATABASE_PASSWORD").unwrap_or_else(|_| {
        eprintln!("❌ Failed to retrieve password from Docker secret and .env");
        std::process::exit(1);
    })
}