-- creates the database

CREATE DATABASE chatdb;
USE chatdb;

CREATE TABLE IF NOT EXISTS channels (
    id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages(
    id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    channelID MEDIUMINT UNSIGNED NOT NULL,
    senderID VARCHAR(50) NOT NULL,
    timestamp BIGINT UNSIGNED NOT NULL,
    parentID MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    thumbsUpCount MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    thumbsDownCount MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    body VARCHAR(2000) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE messages ADD INDEX messagesChannelIDIndex(channelID);
ALTER TABLE messages ADD INDEX messagesTimestampIndex(timestamp);
ALTER TABLE messages ADD CONSTRAINT messagesSenderIDForeign FOREIGN KEY (senderId) REFERENCES users(id);
ALTER TABLE messages ADD CONSTRAINT messagesChannelIDForeign FOREIGN KEY (channelID) REFERENCES channels(id);
