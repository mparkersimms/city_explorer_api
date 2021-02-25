-- psql -f schema.sql -d places

DROP TABLE city;

CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude REAL,
    longitude REAL

    
);
