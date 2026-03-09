CREATE TABLE weather_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    weather_condition VARCHAR(100) NOT NULL,
    recommended_clothes TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE weather_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    weather_condition VARCHAR(100) NOT NULL,
    recommended_clothes TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE weather_queries
ADD COLUMN user_id INT NULL,
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id);