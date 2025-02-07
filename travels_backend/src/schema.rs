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
        #[max_length = 36]
        uuid_user_id -> Nullable<Char>,
        #[max_length = 100]
        first_name -> Nullable<Varchar>,
        #[max_length = 100]
        last_name -> Nullable<Varchar>,
        #[max_length = 255]
        email -> Nullable<Varchar>,
        #[max_length = 255]
        password -> Nullable<Varchar>,
        created_at -> Nullable<Timestamp>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    places,
    users,
);
