-- -----------------------------------------------------
-- Schema survivor
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `survivor`;
USE `survivor`;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `founder_id` INT(11) UNSIGNED DEFAULT NULL,
    `investor_id` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_email` (`email`)
);

-- -----------------------------------------------------
-- Table `projects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `sector` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `age` FLOAT NOT NULL,
    `published` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `project_status` ENUM('Done', 'In progress', 'Not started') DEFAULT 'Not started',
    `views` INT(11) DEFAULT 0,
    `image` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `startups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `startups` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `legal_status` VARCHAR(255) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` TEXT DEFAULT NULL,
    `website_url` VARCHAR(255) DEFAULT NULL,
    `social_media_url` VARCHAR(255) DEFAULT NULL,
    `project_status` ENUM('Done', 'In progress', 'Not started') DEFAULT 'Not started',
    `needs` TEXT DEFAULT NULL,
    `sector` VARCHAR(255) DEFAULT NULL,
    `maturity` VARCHAR(255) DEFAULT NULL,
    `image` VARCHAR(255) DEFAULT NULL,
    `views` INT(11) DEFAULT 0,
    PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `founders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `founders` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `startup_id` INT(11) UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_founder_startup` FOREIGN KEY (`startup_id`) REFERENCES `startups` (`id`) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table `news`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `news` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `startup_id` INT(11) UNSIGNED DEFAULT NULL,
    `news_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `location` VARCHAR(100) DEFAULT NULL,
    `title` VARCHAR(255) DEFAULT NULL,
    `category` VARCHAR(50) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_news_startup` FOREIGN KEY (`startup_id`) REFERENCES `startups` (`id`) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Table `investors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `investors` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `legal_status` VARCHAR(50) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` TEXT DEFAULT NULL,
    `investor_type` VARCHAR(50) DEFAULT NULL,
    `investment_focus` VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `partners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `partners` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `legal_status` VARCHAR(50) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` TEXT DEFAULT NULL,
    `partnership_type` VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `dates` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `location` VARCHAR(100) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `event_type` VARCHAR(50) DEFAULT NULL,
    `target_audience` VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- INSERT Projects exemple
-- -----------------------------------------------------
INSERT INTO survivor.projects (title, description, sector, age, location, image) VALUES
("Julien Co", "description", "Finance", 2, "Paris", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kKDLP60jBedITyXUdF26-JSmc2-_gYJSeg&s"),
("Yarda Games", "description", "Video Games", 4, "Chaloupe", "https://hips.hearstapps.com/hmg-prod/images/chicken-curry-index-65a1629f3c1e7.jpg");

-- -----------------------------------------------------
-- INSERT Events exemple
-- -----------------------------------------------------
INSERT INTO survivor.events (name, dates, location, description, event_type, target_audience) VALUES
("Keynote Survivor", "2025-09-12 09:00:00", "EPITECH", "Présentation de Survivor", "Keynote", "EPITECH students");
