use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use diesel::prelude::*;

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
    // Initialize the database connection pool (Docker Secrets will now provide the password)
    let pool = init_pool();

    // Test the database connection
    let mut conn = pool.get().expect("Failed to get database connection");
    diesel::sql_query("SELECT 1")
        .execute(&mut conn)
        .expect("Database connection test failed");

    // Debugging: Print what the server is binding to
    println!("Binding Actix-web server to 0.0.0.0:8000");

    // Start the Actix web server
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .configure(auth_routes)  
            .configure(places_routes) 
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}