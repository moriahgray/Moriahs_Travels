use actix_web::{web, App, HttpServer};
use diesel::prelude::*;
use dotenvy::dotenv;

mod diesel_types;

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
use crate::utils::db::init_pool;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file
    dotenv().ok();

    // Initialize the database connection pool (Docker Secrets will now provide the password)
    let pool = init_pool();

    // Test the database connection
    let mut conn = pool.get().expect("Failed to get database connection");
    diesel::sql_query("SELECT 1")
        .execute(&mut conn)
        .expect("Database connection test failed");

    println!("Starting server on http://127.0.0.1:8000");

    // Start the Actix web server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))  // Pass the pool to the app
            .configure(auth_routes)  // Add auth routes
            .configure(places_routes)  // Add places routes
    })
    .bind("127.0.0.1:8000")?  // Bind the server to port 8000
    .run()  // Start the server
    .await
}