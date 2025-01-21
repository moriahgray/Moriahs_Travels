use actix_web::{web, HttpResponse, Responder, Error};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::{Place, NewPlace};
use crate::schema::places::dsl::*;
use crate::utils::db::DbPool;
use bigdecimal::BigDecimal;

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

#[derive(Serialize)]
pub struct PlaceResponse {
    pub id: i32,
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
    pub created_at: Option<String>,
}

pub async fn add_place(
    pool: web::Data<DbPool>,
    place_data: web::Json<NewPlaceRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

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
        imageUri: place_data.image_uri.clone(),
        address: place_data.address.clone(),
    };

    diesel::insert_into(places)
        .values(&new_place)
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to insert place: {}", err))
        })?;

    Ok(HttpResponse::Created().json(serde_json::json!({
        "message": "Place added successfully"
    })))
}

pub async fn get_places(pool: web::Data<DbPool>) -> Result<HttpResponse, actix_web::Error> {
    let conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    let results = places
        .load::<Place>(&mut conn)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to fetch places"))?;

    let places_response: Vec<PlaceResponse> = results
        .into_iter()
        .map(|place| PlaceResponse {
            id: place.id,
            user_id: place.user_id,
            title: place.title,
            description: place.description,
            latitude: place.latitude,
            longitude: place.longitude,
            plans: place.plans,
            category: place.category,
            hotels: place.hotels,
            restaurants: place.restaurants,
            image_uri: place.image_uri,
            address: place.address,
            created_at: place.created_at.map(|datetime| datetime.to_string()),
        })
        .collect();

    Ok(HttpResponse::Ok().json(places_response))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/places")
            .route(web::post().to(add_place))
            .route(web::get().to(get_places)),
    );
}