use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

// Initializes the database connection pool with improved error handling
pub fn init_pool(database_url: &str) -> DbPool {
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    r2d2::Pool::builder()
        .max_size(15) // Increased pool size for better performance
        .build(manager)
        .expect("Failed to create database pool")
}