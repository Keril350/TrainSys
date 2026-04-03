CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE train (
    id SERIAL PRIMARY KEY,
    number VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(50)
);

CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100),
    code VARCHAR(20)
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    station_id INTEGER NOT NULL,
    train_id INTEGER NOT NULL,
    route VARCHAR(255),
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,

    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES train(id) ON DELETE CASCADE
);

CREATE TABLE ticket (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    schedule_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    purchase_date TIMESTAMP,
    seat_number VARCHAR(10) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,

    CONSTRAINT unique_seat_per_schedule UNIQUE (schedule_id, seat_number)
);