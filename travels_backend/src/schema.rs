// @generated automatically by Diesel CLI.

diesel::table! {
    places (id) {
        id -> Integer,
        #[max_length = 6]
        user_id -> Varchar,
        #[max_length = 255]
        title -> Varchar,
        description -> Nullable<Text>,
        latitude -> Decimal,
        longitude -> Decimal,
        plans -> Nullable<Text>,
        #[max_length = 100]
        category -> Nullable<Varchar>,
        hotels -> Nullable<Text>,
        restaurants -> Nullable<Text>,
        #[max_length = 255]
        imageUri -> Nullable<Varchar>,
        #[max_length = 255]
        address -> Nullable<Varchar>,
        created_at -> Nullable<Datetime>,
    }
}

diesel::table! {
    users (user_id) {
        #[max_length = 6]
        user_id -> Varchar,
        #[max_length = 100]
        first_name -> Varchar,
        #[max_length = 100]
        last_name -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password -> Varchar,
        created_at -> Nullable<Datetime>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    places,
    users,
);
