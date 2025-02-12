use actix_web::{web, HttpResponse};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::{Place, NewPlace};
use crate::schema::places::dsl::*; 
use crate::utils::db::DbPool;
use bigdecimal::BigDecimal;
use log::{info, error};
use diesel::AsChangeset;

// Explicitly import `table` to avoid module conflicts
use crate::schema::places::table as places_table;

#[derive(Deserialize, Debug)]
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
    #[serde(rename = "imageUri")]
    pub image_uri: Option<String>,
    pub address: Option<String>,
}

#[derive(Deserialize, Debug, AsChangeset)]
#[diesel(table_name = crate::schema::places)]
pub struct UpdatePlaceRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub latitude: Option<BigDecimal>,
    pub longitude: Option<BigDecimal>,
    pub plans: Option<String>,
    pub category: Option<String>,
    pub hotels: Option<String>,
    pub restaurants: Option<String>,
    #[serde(rename = "imageUri")]
    pub image_uri: Option<String>,
    pub address: Option<String>,
}

#[derive(Serialize, Debug)]
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

// Add a new place to the database
pub async fn add_place(
    pool: web::Data<DbPool>,
    place_data: web::Json<NewPlaceRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    info!("Received request to add place: {:?}", place_data);

    let mut conn = pool.get().map_err(|e| {
        error!("Database connection error: {}", e);
        actix_web::error::ErrorInternalServerError("Database connection error")
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
        image_uri: place_data.image_uri.clone(),
        address: place_data.address.clone(),
    };

    match diesel::insert_into(places_table) // Use `places_table` to avoid ambiguity
        .values(&new_place)
        .execute(&mut conn)
    {
        Ok(_) => {
            info!("Successfully added place: {}", new_place.title);
            Ok(HttpResponse::Created().json(serde_json::json!({
                "message": "Place added successfully"
            })))
        }
        Err(err) => {
            error!("Failed to insert place: {}", err);
            Err(actix_web::error::ErrorInternalServerError("Failed to insert place"))
        }
    }
}

// Fetch all places or filter by category
pub async fn get_places(
    pool: web::Data<DbPool>,
    query: web::Query<Option<String>>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut conn = pool.get().map_err(|e| {
        error!("Database connection error: {}", e);
        actix_web::error::ErrorInternalServerError("Database connection error")
    })?;

    let results = match query.into_inner() {
        Some(filter_category) => {
            info!("Fetching places with category: {}", filter_category);
            places
                .filter(crate::schema::places::dsl::category.eq(filter_category)) // Correctly reference `category`
                .load::<Place>(&mut conn)
                .map_err(|err| {
                    error!("Error fetching places: {}", err);
                    actix_web::error::ErrorInternalServerError("Failed to fetch places")
                })?
        }
        None => {
            info!("Fetching all places");
            places
                .load::<Place>(&mut conn)
                .map_err(|err| {
                    error!("Error fetching places: {}", err);
                    actix_web::error::ErrorInternalServerError("Failed to fetch places")
                })?
        }
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

// Update an existing place
pub async fn update_place(
    pool: web::Data<DbPool>,
    place_id: web::Path<i32>,
    place_data: web::Json<UpdatePlaceRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    info!("Received update request for place ID: {}", place_id);

    let mut conn = pool.get().map_err(|e| {
        error!("Database connection error: {}", e);
        actix_web::error::ErrorInternalServerError("Database connection error")
    })?;

    let target = places.filter(crate::schema::places::dsl::id.eq(*place_id));

    match diesel::update(target)
        .set(&*place_data) // Correctly update fields using `AsChangeset`
        .execute(&mut conn)
    {
        Ok(_) => {
            info!("Successfully updated place ID: {}", place_id);
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "message": "Place updated successfully"
            })))
        }
        Err(err) => {
            error!("Failed to update place: {}", err);
            Err(actix_web::error::ErrorInternalServerError("Failed to update place"))
        }
    }
}

// Delete a place
pub async fn delete_place(
    pool: web::Data<DbPool>,
    place_id: web::Path<i32>,
) -> Result<HttpResponse, actix_web::Error> {
    info!("Received delete request for place ID: {}", place_id);

    let mut conn = pool.get().map_err(|e| {
        error!("Database connection error: {}", e);
        actix_web::error::ErrorInternalServerError("Database connection error")
    })?;

    let target = places.filter(crate::schema::places::dsl::id.eq(*place_id));

    match diesel::delete(target).execute(&mut conn) {
        Ok(_) => {
            info!("Successfully deleted place ID: {}", place_id);
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "message": "Place deleted successfully"
            })))
        }
        Err(err) => {
            error!("Failed to delete place: {}", err);
            Err(actix_web::error::ErrorInternalServerError("Failed to delete place"))
        }
    }
}

// Register routes
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/places")
            .route(web::post().to(add_place))
            .route(web::get().to(get_places))
    )
    .service(
        web::resource("/places/{id}")
            .route(web::put().to(update_place))
            .route(web::delete().to(delete_place))
    );
}