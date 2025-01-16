use diesel::r2d2::{self, ConnectionManager};
use diesel::MysqlConnection;

pub type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

// Initializes the database connection pool
pub fn init_pool(database_url: &str) -> DbPool {
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database pool")
}