use actix_web::{web, HttpResponse, HttpRequest};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::{Place, NewPlace};
use crate::schema::places;
use crate::utils::db::DbPool;
use crate::utils::jwt::decode_jwt;
use bigdecimal::BigDecimal;
use diesel::query_builder::AsChangeset;

#[derive(Deserialize)]
pub struct QueryParams {
    pub category: Option<String>,
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

// Fetch all places
pub async fn get_places(
    pool: web::Data<DbPool>,
    query: web::Query<QueryParams>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    let category_filter = query.category.clone().unwrap_or_else(|| "".to_string());

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

    let places_response: Vec<PlaceResponse> = results.into_iter().map(|place| PlaceResponse {
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
    }).collect();

    Ok(HttpResponse::Ok().json(places_response))
}

// Fetch a single place by ID
pub async fn get_place_by_id(
    pool: web::Data<DbPool>,
    place_id: web::Path<i32>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    let place = places::table
        .filter(places::id.eq(*place_id))
        .first::<Place>(&mut conn)
        .optional()
        .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to fetch place"))?;

    match place {
        Some(place) => {
            let response = PlaceResponse {
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
            };

            Ok(HttpResponse::Ok().json(response))
        }
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Place not found"
        }))),
    }
}

//Extract `user_id` from JWT Token in `add_place`
pub async fn add_place(
    pool: web::Data<DbPool>,
    place_data: web::Json<NewPlace>,
    req: HttpRequest,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Database connection error: {}", e))
    })?;

    // Extract JWT token and decode `user_id`
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|value| value.to_str().ok())
        .and_then(|auth| auth.strip_prefix("Bearer "))
        .unwrap_or_default()
        .to_string();

    if token.is_empty() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Missing or invalid token"
        })));
    }

    let user_id = match decode_jwt(&token) {
        Ok(claims) => claims.claims.sub,
        Err(_) => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid token"
            })));
        }
    };

    let mut new_place = place_data.into_inner();
    new_place.user_id = user_id;

    diesel::insert_into(places::table)
        .values(&new_place)
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to insert place: {}", err))
        })?;

    Ok(HttpResponse::Created().json(serde_json::json!({
        "message": "Place added successfully"
    })))
}

// ✅ Define UpdatePlaceRequest Struct
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

// ✅ Define PlaceUpdate Struct for Diesel
#[derive(AsChangeset)]
#[diesel(table_name = places)] 
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

// ✅ Updated: Update a place
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

    let deleted_rows = diesel::delete(places::table.filter(places::id.eq(*place_id)))
        .execute(&mut conn)
        .map_err(|err| {
            actix_web::error::ErrorInternalServerError(format!("Failed to delete place: {}", err))
        })?;

    if deleted_rows == 0 {
        return Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "Place not found"
        })));
    }

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Place deleted successfully"
    })))
}