use diesel::{Queryable, Insertable};
use serde::{Deserialize, Serialize};
use crate::schema::{users, places};
use bigdecimal::BigDecimal;
use chrono::NaiveDateTime;

#[derive(Queryable, Serialize, Deserialize, Debug)]
#[diesel(table_name = users)]
pub struct User {
    pub user_id: String,
    pub uuid_user_id: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub user_id: String,
    pub uuid_user_id: Option<String>,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
#[diesel(table_name = places)]
pub struct Place {
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
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Deserialize, Insertable, Serialize, Debug)]
#[diesel(table_name = places)]
pub struct NewPlaceRequest {
    pub title: String,
    pub description: Option<String>,
    pub latitude: Option<BigDecimal>,
    pub longitude: Option<BigDecimal>,
    pub plans: Option<String>,
    pub category: String,
    pub hotels: Option<String>,
    pub restaurants: Option<String>,
    pub image_uri: Option<String>,
    pub address: Option<String>,
}

#[derive(Insertable, Debug)]
#[diesel(table_name = places)]
pub struct NewPlace {
    pub user_id: String,
    pub title: String,
    pub description: Option<String>,
    pub latitude: Option<BigDecimal>,
    pub longitude: Option<BigDecimal>,
    pub plans: Option<String>,
    pub category: String,
    pub hotels: Option<String>,
    pub restaurants: Option<String>,
    pub image_uri: Option<String>,
    pub address: Option<String>,
}