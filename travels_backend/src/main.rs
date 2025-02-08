use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_cors::Cors;
use diesel::prelude::*;
use dotenvy::dotenv;
use log::{info, error};

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

/// Health check route to test if the server is running
async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("Server is running!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize the logger
    env_logger::init();
    
    // Load the .env file to access environment variables
    dotenv().ok();

    // Initialize the database connection pool
    let pool = init_pool();

    // Test the database connection
    let mut conn = pool.get().expect("Failed to get database connection");
    match diesel::sql_query("SELECT 1")
        .execute(&mut conn)
    {
        Ok(_) => info!("Database connection successful"),
        Err(e) => error!("Database connection test failed: {}", e),
    };

    // Debugging: Print that the server is binding correctly
    info!("Binding Actix-web server to 0.0.0.0:8000");

    // Start the Actix-web server
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .configure(auth_routes)
            .configure(places_routes)
            .route("/health", web::get().to(health_check))
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}