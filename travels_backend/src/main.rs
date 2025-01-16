use dotenvy::dotenv;
use actix_web::{web, App, HttpServer};

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

use handlers::auth::{signup, login};
use handlers::places::{add_place, get_places};
use utils::db::init_pool;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = init_pool(&database_url);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/signup", web::post().to(signup))
            .route("/login", web::post().to(login))
            .route("/places", web::post().to(add_place))
            .route("/places", web::get().to(get_places))
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}