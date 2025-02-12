use actix_web::{web, HttpResponse};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::{Place, NewPlace};
use crate::schema::places;
use crate::utils::db::DbPool;
use bigdecimal::BigDecimal;
use diesel::query_builder::AsChangeset;

#[derive(Deserialize)]
pub struct QueryParams {
    pub category: Option<String>,
}

// Response struct for returning place data
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

// Fetch places from the database
pub async fn get_places(
    pool: web::Data<DbPool>,
    query: web::Query<QueryParams>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    let category_filter = query.category.clone().unwrap_or_else(|| "".to_string());

    println!("Fetching places with category: {:?}", category_filter);

    let results = if !category_filter.is_empty() {
        places::table
            .filter(places::category.eq(category_filter))
            .load::<Place>(&mut conn)
            .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to fetch places"))?
    } else {
        places::table
            .load::<Place>(&mut conn)
            .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to fetch places"))?
    };

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
            created_at: place.created_at.map(|dt| dt.to_string()),
        })
        .collect();

    Ok(HttpResponse::Ok().json(places_response))
}

// Add a new place
pub async fn add_place(
    pool: web::Data<DbPool>,
    place_data: web::Json<NewPlace>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    println!("Adding place: {:?}", place_data);

    diesel::insert_into(places::table)
        .values(&place_data.into_inner())
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to insert place: {}", err))
        })?;

    Ok(HttpResponse::Created().json(serde_json::json!({
        "message": "Place added successfully"
    })))
}

// **✅ FIXED: Update Place Request with Debug Trait**
#[derive(Debug, Deserialize)]
pub struct UpdatePlaceRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub latitude: Option<BigDecimal>,
    pub longitude: Option<BigDecimal>,
    pub plans: Option<String>,
    pub category: Option<String>,
    pub hotels: Option<String>,
    pub restaurants: Option<String>,
    pub image_uri: Option<String>,
    pub address: Option<String>,
}
#[derive(AsChangeset)]
#[diesel(table_name = places)] // ✅ Correct usage
struct PlaceUpdate<'a> {
    title: Option<&'a str>,
    description: Option<&'a str>,
    latitude: Option<&'a BigDecimal>,
    longitude: Option<&'a BigDecimal>,
    plans: Option<&'a str>,
    category: Option<&'a str>,
    hotels: Option<&'a str>,
    restaurants: Option<&'a str>,
    image_uri: Option<&'a str>,
    address: Option<&'a str>,
}

// **✅ FIXED: Update Function That Works Correctly**
pub async fn update_place(
    pool: web::Data<DbPool>,
    place_id: web::Path<i32>,
    place_data: web::Json<UpdatePlaceRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    println!("Updating place ID {} with data: {:?}", place_id, place_data);

    let update_data = PlaceUpdate {
        title: place_data.title.as_deref(),
        description: place_data.description.as_deref(),
        latitude: place_data.latitude.as_ref(),
        longitude: place_data.longitude.as_ref(),
        plans: place_data.plans.as_deref(),
        category: place_data.category.as_deref(),
        hotels: place_data.hotels.as_deref(),
        restaurants: place_data.restaurants.as_deref(),
        image_uri: place_data.image_uri.as_deref(),
        address: place_data.address.as_deref(),
    };

    diesel::update(places::table.filter(places::id.eq(*place_id)))
        .set(&update_data)
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to update place: {}", err))
        })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Place updated successfully"
    })))
}

// Delete a place
pub async fn delete_place(
    pool: web::Data<DbPool>,
    place_id: web::Path<i32>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    println!("Deleting place ID: {}", place_id);

    diesel::delete(places::table.filter(places::id.eq(*place_id)))
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to delete place: {}", err))
        })?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Place deleted successfully"
    })))
}

// Register routes
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/places")
            .route(web::post().to(add_place))
            .route(web::get().to(get_places)),
    )
    .service(
        web::resource("/places/{id}")
            .route(web::put().to(update_place))
            .route(web::delete().to(delete_place)),
    );
}