use actix_web::{web, App, HttpServer};
use diesel::RunQueryDsl;
use dotenvy::dotenv;
use std::env;
use utils::db::init_pool;
use utils::keyring;

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
    pub mod keyring;
}

use handlers::auth::init_routes as auth_routes;
use handlers::places::init_routes as places_routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    // Check for command-line arguments
    let args: Vec<String> = env::args().collect();
    if args.len() > 1 {
        match args[1].as_str() {
            "--store-password" => {
                keyring::store_password();
                return Ok(());
            }
            "--delete-password" => {
                keyring::delete_password();
                return Ok(());
            }
            _ => {
                println!("Unknown option. Use --store-password or --delete-password.");
                return Ok(());
            }
        }
    }

    // Initialize the database connection pool
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
            .app_data(web::Data::new(pool.clone()))
            .configure(auth_routes)
            .configure(places_routes)
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}