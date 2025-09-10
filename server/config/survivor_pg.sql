DROP SCHEMA IF EXISTS survivor CASCADE;
CREATE SCHEMA survivor;
SET search_path TO survivor;

-- Table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    founder_id INT,
    investor_id INT
);

-- Table projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sector VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    age REAL NOT NULL,
    published TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_status VARCHAR(20) DEFAULT 'Not started',
    views INT DEFAULT 0,
    image VARCHAR(255) NOT NULL
);

-- Table startups
CREATE TABLE startups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    legal_status VARCHAR(255),
    address VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    website_url VARCHAR(255),
    social_media_url VARCHAR(255),
    project_status VARCHAR(20) DEFAULT 'Not started',
    needs TEXT,
    sector VARCHAR(255),
    maturity VARCHAR(255),
    image VARCHAR(255),
    views INT DEFAULT 0
);

-- Table founders
CREATE TABLE founders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    startup_id INT NOT NULL REFERENCES startups(id) ON DELETE CASCADE
);

-- Table news
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    startup_id INT REFERENCES startups(id) ON DELETE SET NULL,
    news_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100),
    title VARCHAR(255),
    category VARCHAR(50),
    description TEXT
);

-- Table investors
CREATE TABLE investors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    legal_status VARCHAR(50),
    address VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    investor_type VARCHAR(50),
    investment_focus VARCHAR(50)
);

-- Table partners
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    legal_status VARCHAR(50),
    address VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    partnership_type VARCHAR(50)
);

-- Table events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dates TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100),
    description TEXT,
    event_type VARCHAR(50),
    target_audience VARCHAR(50)
);

-- Inserts Projects exemple
INSERT INTO projects (title, description, sector, age, location, image)
VALUES
('Julien Co', 'description', 'Finance', 2, 'Paris', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kKDLP60jBedITyXUdF26-JSmc2-_gYJSeg&s'),
('Yarda Games', 'description', 'Video Games', 4, 'Chaloupe', 'https://hips.hearstapps.com/hmg-prod/images/chicken-curry-index-65a1629f3c1e7.jpg');

-- Inserts Events exemple
INSERT INTO events (name, dates, location, description, event_type, target_audience)
VALUES
('Keynote Survivor', '2025-09-12 09:00:00', 'EPITECH', 'Présentation de Survivor', 'Keynote', 'EPITECH students');
