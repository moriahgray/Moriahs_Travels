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
    pub imageUri: Option<String>,
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

// Add a new place to the database
pub async fn add_place(
    pool: web::Data<DbPool>,
    place_data: web::Json<NewPlaceRequest>,
) -> Result<HttpResponse, actix_web::Error> { // Updated return type
    let mut conn = pool.get()
        .map_err(|_| HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Database connection error"
        })))?;

    let new_place = NewPlace {
        user_id: place_data.userId.clone(),
        title: place_data.title.clone(),
        description: place_data.description.clone(),
        latitude: place_data.latitude.clone(),
        longitude: place_data.longitude.clone(),
        plans: place_data.plans.clone(),
        category: place_data.category.clone(),
        hotels: place_data.hotels.clone(),
        restaurants: place_data.restaurants.clone(),
        imageUri: place_data.imageUri.clone(),
        address: place_data.address.clone(),
    };

    match diesel::insert_into(places)
        .values(&new_place)
        .execute(&mut conn)
    {
        Ok(_) => Ok(HttpResponse::Created().json(serde_json::json!({
            "message": "Place added successfully"
        }))), // Return wrapped in Result
        Err(err) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to insert place: {}", err)
        }))), // Return wrapped in Result
    }
}

// Fetch places from the database
pub async fn get_places(pool: web::Data<DbPool>) -> Result<HttpResponse, actix_web::Error> {
    // Get a database connection from the pool
    let conn = pool.get().map_err(|_| HttpResponse::InternalServerError().finish().into())?;

    // Query the places from the database
    let results = web::block(move || {
        use crate::schema::places::dsl::*;
        places.load::<Place>(&mut conn) // Load all places into a vector of `Place`
    })
    .await
    .map_err(|_| HttpResponse::InternalServerError().finish().into())?;

    // Map the result to the `PlaceResponse` structure
    let places_response: Vec<PlaceResponse> = results
        .into_iter() // Iterate over the vector of `Place` objects
        .map(|place| PlaceResponse {
            id: place.id,  // Access the fields of each individual `Place`
            userId: place.user_id,
            title: place.title,
            description: place.description,
            latitude: place.latitude,
            longitude: place.longitude,
            plans: place.plans,
            category: place.category,
            hotels: place.hotels,
            restaurants: place.restaurants,
            imageUri: place.image_uri,
            address: place.address,
            created_at: place.created_at.map(|datetime| datetime.to_string()), // Handle Option<NaiveDateTime>
        })
        .collect();  // Collect into a `Vec<PlaceResponse>`

    // Return the results as a JSON response
    Ok(HttpResponse::Ok().json(places_response)) // Return the result wrapped in a `Result`
}

// Register routes
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/places")
            .route(web::post().to(add_place))
            .route(web::get().to(get_places)),
    );
}