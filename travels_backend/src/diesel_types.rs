use bigdecimal::BigDecimal;
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::Numeric;
use std::io::Write;

/// Implement `FromSql` to convert database values into `BigDecimal`
impl<DB> FromSql<Numeric, DB> for BigDecimal
where
    DB: diesel::backend::Backend,
    String: FromSql<Numeric, DB>,
{
    fn from_sql(bytes: diesel::backend::RawValue<DB>) -> deserialize::Result<Self> {
        let value = String::from_sql(bytes)?;
        value.parse().map_err(|_| "Failed to parse BigDecimal".into())
    }
}

/// Implement `ToSql` to convert `BigDecimal` into database values
impl<DB> ToSql<Numeric, DB> for BigDecimal
where
    DB: diesel::backend::Backend,
{
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, DB>) -> serialize::Result {
        write!(out, "{}", self)?;
        Ok(IsNull::No)
    }
}