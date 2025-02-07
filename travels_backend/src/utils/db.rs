use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;
use std::{env, thread, time::Duration};

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

pub fn init_pool() -> DbPool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    if database_url.is_empty() {
        eprintln!("Final DATABASE_URL is EMPTY after replacement!");
        std::process::exit(1);
    }

    for attempt in 1..=5 {
        let manager = ConnectionManager::<MysqlConnection>::new(database_url.clone());

        match r2d2::Pool::builder().max_size(15).build(manager) {
            Ok(pool) => {
                println!("Database pool created successfully!");
                return pool;
            }
            Err(e) => {
                eprintln!("Attempt {} - Failed to create pool: {}", attempt, e);
                thread::sleep(Duration::from_secs(5));
            }
        }
    }

    panic!("All attempts failed! Could not create database pool.");
}