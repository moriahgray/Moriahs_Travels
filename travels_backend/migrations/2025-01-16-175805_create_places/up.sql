CREATE TABLE places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(6) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    plans TEXT,
    category VARCHAR(100),
    hotels TEXT,
    restaurants TEXT,
    image_uri VARCHAR(1024),
    address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);