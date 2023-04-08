const db = require("./dbConnections");

const insertChannelQuery = "INSERT INTO channels (name) VALUEs (?)";
const selectAllChannels = "SELECT * FROM channels";
const selectSomeChannels = "SELECT * FROM channels WHERE id = ?";
const insertUserQuery = "INSERT INTO users (id, password, name) VALUES (?, ?, ?)";
const selectAllUsersQuery = "SELECT * FROM users";
const selectUserByIdQuery = "SELECT * FROM users WHERE id = ?";


async function insertChannel(channelName) {
	const result = await db.query1(insertChannelQuery, [channelName]);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
		insertId: result.insertId,
	};
}

async function selectChannelById(id) {
	const result = await db.query1(selectSomeChannels, [id]);
	return result;
}

async function selectChannelsByName(name) {
	const result = await db.query1("SELECT * FROM channels WHERE name = ?", [
		name,
	]);
	return result;
}

async function insertUser(id, password, name) {
	const result = await db.query1(insertUserQuery, [id, password, name]);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
		insertId: result.insertId,
	};
}

async function selectAllUsers() {
	const result = await db.query1(selectAllUsersQuery, []);
	return result;
}

async function selectUserById(id) {
	const result = await db.query1(selectUserByIdQuery, [id]);
	return result;
}

async function insertMessage(channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body) {
	if (channelID === undefined || senderID === undefined || timestamp === undefined || parentID === undefined || thumbsUpCount === undefined || thumbsDownCount === undefined || body === undefined) {
		console.log(channelID);
		console.log(senderID);
		console.log(parentID);
		console.log(thumbsUpCount);
		console.log(thumbsDownCount);
		console.log(body);

		throw new Error("*****One or more parameters are undefined. Please check the input values.*****");
	}
	console.log("1");
	const sql = `
        INSERT INTO messages (channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
	const params = [channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body];
	console.log('2');
	const result = await db.query1(sql, params);
	console.log(result);
	return {
		affectedRows: result.affectedRows,
		warningStatus: result.warningStatus,
		insertId: result.insertId,
	};
}

async function getMessageByID(messageID) {
	const sql = `
        SELECT * FROM messages WHERE id = ?
    `;
	const params = [messageID];
	const [message] = await db.query1(sql, params);
	return message;
}
/*
test("db_ut_2", async () => {
	const channelName = "db_ut_2";
	let result = await insertChannel(channelName);
	let insertId = result.insertId;
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	result = await selectChannelById(insertId);
	let expected = [
		{
			id: insertId,
			name: channelName,
			deleted: 0,
		},
	];
	expect(result).toEqual(expected);

	const longChannelName = "a".repeat(100);
	result = await insertChannel(longChannelName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	insertId = result.insertId;
	expected = [
		{
			id: insertId,
			name: longChannelName,
			deleted: 0,
		},
	];
	result = await selectChannelById(insertId);
	expect(result).toEqual(expected);

	result = await insertChannel(channelName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	result = await selectChannelsByName(channelName);
	expect(result.length).not.toBe(1);
	expect(result[0].id).not.toBe(result[1].id);
});

test("db_ut_3", async () => {
	const userId = "db_ut_3-id" + Date.now()/100000;
	const password = "newUserPassword";
	const name = "db_ut_3-name";

	let result = await insertUser(userId, password, name);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	let users = await selectAllUsers();
	expect(users).toEqual(
		expect.arrayContaining([
			{
				id: userId,
				password: password,
				name: name,
				isAdmin: 0,
				deleted: 0,
			},
		])
	);

	const userId2 = "db_ut_3-id2"+Date.now()/100000;
	const nullName = null;

	try {
		await insertUser(userId2, password, nullName);
	} catch (error) {
		expect(error).toBeDefined();
		expect(error.message).toContain("Column 'name' cannot be null");
	}

	users = await selectAllUsers();
	expect(users).not.toEqual(
		expect.arrayContaining([
			{
				id: userId2,
				password: password,
				name: userId2,
				isAdmin: 0,
				deleted: 0,
			},
		])
	);


	const userId3 = "db_ut_3-id3"+Date.now()/100000;
	const emptyName = "";

	result = await insertUser(userId3, password, emptyName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	users = await selectAllUsers();
	expect(users).toEqual(
		expect.arrayContaining([
			{
				id: userId3,
				password: password,
				name: userId3,
				isAdmin: 0,
				deleted: 0,
			},
		])
	);


	const userId4 = "db_ut_3-id4"+Date.now()/100000;
	const spaceName = " ";

	result = await insertUser(userId4, password, spaceName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	users = await selectAllUsers();
	expect(users).toEqual(
		expect.arrayContaining([
			{
				id: userId4,
				password: password,
				name: userId4,
				isAdmin: 0,
				deleted: 0,
			},
		])
	);
});

test("db_ut_4", async () => {
	const channelID = 4;
	const senderID = 'u1';
	const timestamp = Date.now();
	const parentID = 0;
	const thumbsUpCount = 2;
	const thumbsDownCount = 1;
	const body = 'db_ut_4';

	const insertResult = await insertMessage(channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body);
		const messageId = insertResult.insertId;
	const selectedMessage = await getMessageByID(messageId);
	expect(selectedMessage).toEqual({
		id: messageId,
		channelID: channelID,
		senderID: senderID,
		timestamp: timestamp,
		parentID: parentID,
		thumbsUpCount: thumbsUpCount,
		thumbsDownCount: thumbsDownCount,
		body: body,
		deleted: 0
	});
})

test("db_ut_5", async () => {
	// 1. INSERT new channel into database, name = null
	try {
		await insertChannel(null);
	} catch (error) {
		// 2. Assert insertion fails
		expect(error).toBeDefined();
		expect(error.message).toContain("Column 'name' cannot be null");
	}

	// 3. INSERT new channel into database, name = ""
	try {
		await insertChannel("");
	} catch (error) {
		// 4. Assert insertion fails
		expect(error).toBeDefined();
		expect(error.message).toContain("Column 'name' cannot be empty");
	}

	// 5. INSERT new channel into database, name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
	const longChannelName = "a".repeat(101);
	try {
		await insertChannel(longChannelName);
	} catch (error) {
		// 6. Assert insertion fails
		expect(error).toBeDefined();
		expect(error.message).toContain("Data too long for column 'name'");
	}
});

test("db_ut_6", async () => {
	// Test cases
	const testCases = [
		{
			id: "",
			password: "abc",
			name: "db_ut_6-FAILED-TEST-STEP 1",
			errorMsg: "Must be between 1 and 50 characters",
		},
		{
			id: " ",
			password: "abc",
			name: "db_ut_6-FAILED-TEST-STEP 2",
			errorMsg: "Must be between 1 and 50 characters",
		},
		{
			id: "a".repeat(51),
			password: "abc",
			name: "db_ut_6-FAILED-TEST-STEP 3",
			errorMsg: "Data too long for column 'id' at row 1",
		},
		{
			id: null,
			password: "abc",
			name: "db_ut_6-FAILED-TEST-STEP 4",
			errorMsg: "Must be between 1 and 50 characters",
		},
		{
			id: "db_ut_6",
			password: null,
			name: "db_ut_6-FAILED-TEST-STEP 5",
			errorMsg: "Invalid password: Must be between 1 and 128 characters",
		},
		{
			id: "db_ut_6-FAILED-TEST-STEP 6",
			password: "a".repeat(129),
			name: "db_ut_6-FAILED-TEST-STEP 6",
			errorMsg: "Data too long for column 'password' at row 1",
		},
		{
			id: "db_ut_6-FAILED-TEST-STEP 7",
			password: "",
			name: "db_ut_6-FAILED-TEST-STEP 7",
			errorMsg: "Invalid password: Must be between 1 and 128 characters",
		},
		{
			id: "db_ut_6-FAILED-TEST-STEP 8",
			password: " ",
			name: "db_ut_6-FAILED-TEST-STEP 8",
			errorMsg: "Invalid password: Must be between 1 and 128 characters",
		},
		{
			id: "db_ut_6-FAILED-TEST-STEP 9",
			password: "abc",
			name: "a".repeat(51),
			errorMsg: "Data too long for column 'name' at row 1",
		},
		{
			id: "u1",
			password: "abc",
			name: "db_ut_6-FAILED-TEST-STEP 10",
			errorMsg: "Duplicate entry 'u1' for key 'PRIMARY'",
		},
	];

	// Run test cases
	for (const testCase of testCases) {
		try {
			await insertUser(testCase.id, testCase.password, testCase.name);
		} catch (error) {
			expect(error).toBeDefined();
			expect(error.message).toContain(testCase.errorMsg);
		}
	}
});

test("db_ut_7", async () => {
	const testCases = [
		{
			channelID: 1000,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 1",
			errorMsg:"Invalid channel ID: The provided channel ID does not exist in the channels table"
		},
		{
			channelID: 0,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 2",
			errorMsg:"Invalid channel ID: The provided channel ID does not exist in the channels table"

		},
		{
			channelID: -1,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 3",
			errorMsg:"Out of range value for column 'channelID' at row 1"

		},
		{
			channelID: 4,
			senderID: "",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 4",
			errorMsg: "Invalid sender ID: Must be between 1 and 50 characters"
		},
		{
			channelID: 4,
			senderID: " ",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 5",
			errorMsg: "Invalid sender ID: Must be between 1 and 50 characters"
		},
		{
			channelID: 4,
			senderID: "100000",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 6",
			errorMsg: "Invalid sender ID: The provided sender ID does not exist in the senders table"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: -1,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 7",
			errorMsg: "Out of range value for column 'parentID' at row 1"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 100000,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 8",
			errorMsg: "Invalid parent ID: The provided parent ID does not exist in the messages table"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: -1,
			thumbsDownCount: 0,
			body: "db_ut_7-FAILED-TEST-STEP 9",
			errorMsg: "Out of range value for column 'thumbsUpCount' at row 1"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: -1,
			body: "db_ut_7-FAILED-TEST-STEP 10",
			errorMsg: "Out of range value for column 'thumbsDownCount' at row 1"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "",
			errorMsg: "Invalid body: Must be between 1 and 2000 characters"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: " ",
			errorMsg: "Invalid body: Must be between 1 and 2000 characters"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: null,
			errorMsg: "Invalid body: Must be between 1 and 2000 characters"
		},
		{
			channelID: 4,
			senderID: "u1",
			timestamp: Date.now(),
			parentID: 0,
			thumbsUpCount: 0,
			thumbsDownCount: 0,
			body: "a".repeat(2001),
			errorMsg: "Data too long for column 'body' at row 1"
		},
	]

	for (const testCase of testCases) {
		try {
			console.log(testCase)
			await insertMessage(testCase.channelID, testCase.senderID, testCase.timestamp, testCase.parentID, testCase.thumbsUpCount, testCase.thumbsDownCount, testCase.body);
		} catch (error) {
			expect(error).toBeDefined();
			console.log("Going into second expect");
			console.log(error);
			expect(error.message).toContain(testCase.errorMsg);
			console.log("After second expect");
		}
	}
});
*/



/*
test("db_ut_13", async () => {
	const expected = [
		{ id: 1, name: "channel1", deleted: 0 },
		{ id: 2, name: "channel2", deleted: 0 },
		{ id: 3, name: "channel3", deleted: 0 },
		{ id: 4, name: "channel4", deleted: 0 },
		{ id: 5, name: "channel5", deleted: 0 },
	];
	const result = await db.query2(selectAllChannels, []);
	expect(result).toEqual(expected);
});
 */