use dotenvy::dotenv;
use actix_web::{web, App, HttpServer};
use utils::db::init_pool;
use diesel::RunQueryDsl;
use std::env;

mod handlers {
    pub mod auth;
    pub mod places;
}

mod models;
mod schema;

mod utils {
    pub mod db;
    pub mod jwt;
}

use handlers::auth::init_routes as auth_routes;
use handlers::places::init_routes as places_routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = init_pool(&database_url);

    // Test the database connection with better error handling
    let mut conn = pool.get().expect("Failed to get database connection");
    diesel::sql_query("SELECT 1")
        .execute(&mut conn)
        .expect("Database connection test failed");

    println!("Starting server on http://127.0.0.1:8000");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .configure(auth_routes)
            .configure(places_routes)
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}