CREATE TABLE users (
    user_id VARCHAR(10) PRIMARY KEY,
    uuid_user_id CHAR(36),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
