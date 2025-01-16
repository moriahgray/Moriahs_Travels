use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::{Place, NewPlace};
use crate::schema::places::dsl::*;
use crate::utils::db::DbPool;

#[derive(Deserialize)]
pub struct NewPlaceRequest {
    pub user_id: String,
    pub title: String,
    pub description: Option<String>,
    pub latitude: f64,
    pub longitude: f64,
    pub plans: Option<String>,
    pub category: Option<String>,
    pub hotels: Option<String>,
    pub restaurants: Option<String>,
    pub image_uri: Option<String>,
    pub address: Option<String>,
}

pub async fn add_place(
    pool: web::Data<DbPool>,
    place_data: web::Json<NewPlaceRequest>,
) -> impl Responder {
    // Get a mutable connection from the pool
    let mut conn = match pool.get() {
        Ok(conn) => conn,
        Err(_) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Database connection error"
        })),
    };

    // Create a new place for insertion
    let new_place = NewPlace {
        user_id: place_data.user_id.clone(),
        title: place_data.title.clone(),
        description: place_data.description.clone(),
        latitude: BigDecimal::from_f64(place_data.latitude)
            .expect("Failed to convert latitude to BigDecimal"),
        longitude: BigDecimal::from_f64(place_data.longitude)
            .expect("Failed to convert longitude to BigDecimal"),
        plans: place_data.plans.clone(),
        category: place_data.category.clone(),
        hotels: place_data.hotels.clone(),
        restaurants: place_data.restaurants.clone(),
        image_uri: place_data.image_uri.clone(),
        address: place_data.address.clone(),
    };

    // Insert the new place into the database
    match diesel::insert_into(places)
        .values(&new_place)
        .execute(&mut conn)
    {
        Ok(_) => HttpResponse::Created().json(serde_json::json!({
            "message": "Place added successfully"
        })),
        Err(err) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to insert place: {}", err)
        })),
    }
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/places").route(web::post().to(add_place)));
}