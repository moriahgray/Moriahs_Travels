use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use serde::Deserialize;
use crate::models::{Place, NewPlace};
use crate::schema::places::dsl::*;
use crate::utils::db::DbPool;

#[derive(Deserialize)]
pub struct NewPlaceRequest {
    pub user_id: String,
    pub title: String,
    pub description: Option<String>,
    pub latitude: BigDecimal,
    pub longitude: BigDecimal,
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
    let mut conn = pool.get()
        .map_err(|_| HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Database connection error"
        })))?;

    let new_place = NewPlace {
        user_id: place_data.user_id.clone(),
        title: place_data.title.clone(),
        description: place_data.description.clone(),
        latitude: place_data.latitude.clone(),
        longitude: place_data.longitude.clone(),
        plans: place_data.plans.clone(),
        category: place_data.category.clone(),
        hotels: place_data.hotels.clone(),
        restaurants: place_data.restaurants.clone(),
        image_uri: place_data.image_uri.clone(),
        address: place_data.address.clone(),
    };

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
    cfg.service(
        web::resource("/places")
            .route(web::post().to(add_place))
            .route(web::get().to(get_places)),
    );
}