const insertChannelQuery = "INSERT INTO channels (name) VALUEs (?)";
const deleteChannelQuery = "UPDATE channels SET deleted = 1 WHERE id = ?";
const selectAllChannelsQuery = "SELECT * FROM channels";
const selectSomeChannelsQuery = "SELECT * FROM channels WHERE id = ?";

const insertUserQuery = "INSERT INTO users (id, password, name) VALUES (?, ?, ?)";
const selectAllUsersQuery = "SELECT * FROM users";
const selectUserByIdQuery = "SELECT * FROM users WHERE id = ?";

const selectMessagesByChannelQuery = "SELECT * FROM messages WHERE channelID = ?"
const deleteMessageQuery = "UPDATE messages SET deleted = 1 WHERE id = ?";



async function insertChannel(connection, channelName) {
	const [result] = await connection.execute(insertChannelQuery, [channelName]);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
		insertId: result.insertId,
	};
}

async function deleteChannelbyID(connection, channelID){
	const [result] = await connection.execute(deleteChannelQuery, [channelID]);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
	};
}

async function selectAllChannels(connection) {
	const [result] =  await connection.execute(selectAllChannelsQuery);
	return result;
}

async function selectChannelById(connection, id) {
	const [result] = await connection.execute(selectSomeChannelsQuery, [id]);
	return result;
}

async function selectChannelsByName(connection, name) {
	const [result] =  await connection.execute("SELECT * FROM channels WHERE name = ?", [
		name,
	]);
	return result;
}

async function insertUser(connection, id, password, name) {
	const [result] = await connection.execute(insertUserQuery, [id, password, name]);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
		insertId: result.insertId,
	};
}

async function selectAllUsers(connection) {
	const [result] =  await connection.execute(selectAllUsersQuery, []);
	return result;
}

async function selectUserById(connection) {
	const [result] = await connection.execute(selectUserByIdQuery, [id]);
	return result;
}

async function insertMessage(connection, channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body) {
	if (channelID === undefined || senderID === undefined || timestamp === undefined || parentID === undefined || thumbsUpCount === undefined || thumbsDownCount === undefined || body === undefined) {
		console.log(channelID);
		console.log(senderID);
		console.log(parentID);
		console.log(thumbsUpCount);
		console.log(thumbsDownCount);
		console.log(body);

		throw new Error("*****One or more parameters are undefined. Please check the input values.*****");
	}
	const sql = `
        INSERT INTO messages (channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
	const params = [channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body];
	const [result] = await connection.execute(sql, params);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
		insertId: result.insertId,
	};
}

async function selectAllMessages(connection) {
	const [result] =  await connection.execute("SELECT * FROM messages", []);
	return result;
}

async function selectMessagesByChannel(connection, channelID) {
	const [result] =  await connection.execute(selectMessagesByChannelQuery, [channelID]);
	return result;
}

async function getMessageByID(connection, messageID) {
	const sql = "SELECT * FROM messages WHERE id = ?";
	const [result] = await connection.execute(sql, [messageID]);
	return result;
}

async function deleteMessageByID(connection, messageID){
	const [result] = await connection.execute(deleteMessageQuery, [messageID]);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
	};
}
module.exports = {
	insertChannel,
	selectAllChannels,
	selectChannelById,
	selectChannelsByName,
	insertUser,
	selectAllUsers,
	selectUserById,
	insertMessage,
	selectMessagesByChannel,
	selectAllMessages,
	getMessageByID,
	deleteMessageByID,
	deleteChannelbyID,
}