-- creates the database

CREATE DATABASE chatdb;
USE chatdb;

CREATE TABLE IF NOT EXISTS channels (
    id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages(
    id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    channelID MEDIUMINT UNSIGNED NOT NULL,
    senderID VARCHAR(50) NOT NULL,
    timestamp BIGINT UNSIGNED NOT NULL,
    parentID MEDIUMINT UNSIGNED NOT NULL,
    thumbsUpCount MEDIUMINT UNSIGNED NOT NULL,
    thumbsDownCount MEDIUMINT UNSIGNED NOT NULL,
    body VARCHAR(2000) NOT NULL
);

ALTER TABLE messages ADD INDEX messagesChannelIDIndex(channelID);
ALTER TABLE messages ADD INDEX messagesTimestampIndex(timestamp);
ALTER TABLE messages ADD CONSTRAINT messagesSenderIDForeign FOREIGN KEY (senderId) REFERENCES users(id);
ALTER TABLE messages ADD CONSTRAINT messagesChannelIDForeign FOREIGN KEY (channelID) REFERENCES channels(id);