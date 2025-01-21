use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;
use bigdecimal::BigDecimal;
use crate::schema::{users, places};

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = users)]
pub struct User {
    pub user_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub user_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
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
    #[diesel(column_name = "imageUri")]
    pub image_uri: Option<String>,
    pub address: Option<String>,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = places)]
pub struct NewPlace {
    pub user_id: String,
    pub title: String,
    pub description: Option<String>,
    pub latitude: BigDecimal,
    pub longitude: BigDecimal,
    pub plans: Option<String>,
    pub category: Option<String>,
    pub hotels: Option<String>,
    pub restaurants: Option<String>,
    #[diesel(column_name = "imageUri")]
    pub image_uri: Option<String>,
    pub address: Option<String>,
}