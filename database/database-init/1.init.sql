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

DELIMITER //
CREATE TRIGGER set_name_before_insert
    BEFORE INSERT ON users
    FOR EACH ROW
BEGIN
    IF NEW.name REGEXP '^[[:space:]]*$' THEN
        SET NEW.name = NEW.id;
    END IF;
END//


CREATE TRIGGER user_before_insert
    BEFORE INSERT
    ON users FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR LENGTH(TRIM(NEW.id)) = 0 OR LENGTH(TRIM(NEW.id)) > 50 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid user ID: Must be between 1 and 50 characters';
    END IF;

    IF NEW.password IS NULL OR LENGTH(TRIM(NEW.password)) = 0 OR LENGTH(TRIM(NEW.password)) > 128 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid password: Must be between 1 and 128 characters';
    END IF;

    IF LENGTH(NEW.name) > 50 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid name: Must be between 1 and 50 characters';
    END IF;
END;
//

CREATE TRIGGER messages_before_insert
    BEFORE INSERT
    ON messages FOR EACH ROW

BEGIN
    DECLARE channel_exists BOOLEAN;
    DECLARE sender_exists BOOLEAN;
    DECLARE parent_exists BOOLEAN;

    SELECT EXISTS (SELECT 1 FROM channels WHERE id = NEW.channelID) INTO channel_exists;
    IF NOT channel_exists THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid channel ID: The provided channel ID does not exist in the channels table';
    END IF;



    IF NEW.senderID IS NULL OR LENGTH(TRIM(NEW.senderID)) = 0 OR LENGTH(TRIM(NEW.senderID)) > 50 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid sender ID: Must be between 1 and 50 characters';
    END IF;

    SELECT EXISTS (SELECT 1 FROM users WHERE id = NEW.senderID) INTO sender_exists;
    IF NOT sender_exists THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid sender ID: The provided sender ID does not exist in the senders table';
    END IF;



    IF NEW.parentID < 0  THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid parent ID: Must be a non-negative integer';
    END IF;

    IF NEW.parentID > 0 THEN
        SELECT EXISTS (SELECT 1 FROM messages WHERE id = NEW.parentID) INTO parent_exists;
        IF NOT parent_exists THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Invalid parent ID: The provided parent ID does not exist in the messages table';
        END IF;
    END IF;


    IF NEW.thumbsUpCount < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid thumbsUp: Must be a non-negative integer';
    END IF;

    IF NEW.thumbsDownCount < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid thumbsDown: Must be a non-negative integer';
    END IF;

    IF NEW.body IS NULL OR LENGTH(TRIM(NEW.body)) = 0 OR LENGTH(NEW.body) > 2000 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid body: Must be between 1 and 2000 characters';
    END IF;
END;
//

DELIMITER ;

ALTER TABLE users ENABLE KEYS;


