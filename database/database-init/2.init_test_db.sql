-- Add test data to users table
USE chatdb;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/test_data_users.txt' INTO TABLE users
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    (id, password, name);

-- Add test data to channels table
    LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/test_data_channels.txt' INTO TABLE channels
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    (id, name);

-- Add test data to messages table
LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/channel_1_test_messages.txt' INTO TABLE messages
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    (id, channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body);
LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/test_data_messages.txt' INTO TABLE messages
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    (id, channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body);