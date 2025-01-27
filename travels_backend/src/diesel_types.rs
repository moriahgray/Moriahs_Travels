use bigdecimal::BigDecimal;
use diesel_derive_newtype::DieselNewType;
use serde::{Deserialize, Serialize};

#[derive(DieselNewType, Serialize, Deserialize, Debug, Clone)]
pub struct MyBigDecimal(BigDecimal);