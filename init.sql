CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),

    role VARCHAR(20) NOT NULL DEFAULT 'USER',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE train_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE train (
    id SERIAL PRIMARY KEY,
    number VARCHAR(20) NOT NULL UNIQUE,
    type_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (type_id) REFERENCES train_type(id)
);

CREATE TABLE wagon (
    id SERIAL PRIMARY KEY,
    train_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (train_id) REFERENCES train(id) ON DELETE CASCADE,

    CONSTRAINT unique_wagon_per_train UNIQUE (train_id, number)
);

CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100),
    code VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_station (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL,
    station_id INTEGER NOT NULL,
    station_order INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES route(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,

    CONSTRAINT unique_station_in_route UNIQUE (route_id, station_id),
    CONSTRAINT unique_order_in_route UNIQUE (route_id, station_order)
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    train_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (train_id) REFERENCES train(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES route(id) ON DELETE CASCADE,

    CONSTRAINT unique_train_departure UNIQUE (train_id, departure_time)
);

CREATE TABLE seat (
    id SERIAL PRIMARY KEY,
    wagon_id INTEGER NOT NULL,
    number VARCHAR(10) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (wagon_id) REFERENCES wagon(id) ON DELETE CASCADE,

    CONSTRAINT unique_seat_per_wagon UNIQUE (wagon_id, number)
);

CREATE TABLE ticket (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    schedule_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    purchase_date TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE,

    CONSTRAINT unique_seat_per_schedule UNIQUE (schedule_id, seat_id)
);

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO train_type (name) VALUES
('PASSENGER'),
('CARGO'),
('EXPRESS');