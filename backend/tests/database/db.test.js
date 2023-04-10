//db.tests.js
const db = require("./dbConnections");
const queries = require( "../../src/utils/dbQueries")


test("db_ut_2", async () => {
	const channelName = "db_ut_2";
	let result = await queries.insertChannel(db.getConnection1(), channelName);
	console.log(result);
	let insertId = result.insertId;
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	result = await queries.selectChannelById(db.getConnection1(), insertId);
	let expected = [
		{
			id: insertId,
			name: channelName,
			deleted: 0,
		},
	];
	expect(result).toEqual(expected);

	const longChannelName = "a".repeat(100);
	result = await queries.insertChannel(db.getConnection1(), longChannelName);
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
	result = await queries.selectChannelById(db.getConnection1(), insertId);
	expect(result).toEqual(expected);

	result = await queries.insertChannel(db.getConnection1(), channelName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	result = await queries.selectChannelsByName(db.getConnection1(), channelName);
	expect(result.length).not.toBe(1);
	expect(result[0].id).not.toBe(result[1].id);
});

test("db_ut_3", async () => {
	const userId = "db_ut_3-id" + Date.now()/100000;
	const password = "newUserPassword";
	const name = "db_ut_3-name";

	let result = await queries.insertUser(db.getConnection1(), userId, password, name);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	let users = await queries.selectAllUsers(db.getConnection1());
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
		await queries.insertUser(db.getConnection1(), userId2, password, nullName);
	} catch (error) {
		expect(error).toBeDefined();
		expect(error.message).toContain("Column 'name' cannot be null");
	}

	users = await queries.selectAllUsers(db.getConnection1());
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

	result = await queries.insertUser(db.getConnection1(), userId3, password, emptyName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	users = await queries.selectAllUsers(db.getConnection1());
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

	result = await queries.insertUser(db.getConnection1(), userId4, password, spaceName);
	expect(result.affectedRows).toBe(1);
	expect(result.warningStatus).toBe(0);

	users = await queries.selectAllUsers(db.getConnection1());
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

	const insertResult = await queries.insertMessage(db.getConnection1(), channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body);
	const messageId = insertResult.insertId;
	const selectedMessage = await queries.getMessageByID(db.getConnection1(), messageId);
	expect(selectedMessage).toEqual([{
		id: messageId,
		channelID: channelID,
		senderID: senderID,
		timestamp: timestamp,
		parentID: parentID,
		thumbsUpCount: thumbsUpCount,
		thumbsDownCount: thumbsDownCount,
		body: body,
		deleted: 0
	}]);
})

test("db_ut_5", async () => {
	// 1. INSERT new channel into database, name = null
	try {
		await queries.insertChannel(db.getConnection1(), null);
	} catch (error) {
		// 2. Assert insertion fails
		expect(error).toBeDefined();
		expect(error.message).toContain("Column 'name' cannot be null");
	}

	// 3. INSERT new channel into database, name = ""
	try {
		await queries.insertChannel(db.getConnection1(), "");
	} catch (error) {
		// 4. Assert insertion fails
		expect(error).toBeDefined();
		expect(error.message).toContain("Column 'name' cannot be empty");
	}

	// 5. INSERT new channel into database, name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
	const longChannelName = "a".repeat(101);
	try {
		await queries.insertChannel(db.getConnection1(), longChannelName);
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
			await queries.insertUser(db.getConnection1(), testCase.id, testCase.password, testCase.name);
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
			//console.log(testCase)
			await queries.insertMessage(db.getConnection1(), testCase.channelID, testCase.senderID, testCase.timestamp, testCase.parentID, testCase.thumbsUpCount, testCase.thumbsDownCount, testCase.body);
		} catch (error) {
			expect(error).toBeDefined();
			//console.log("Going into second expect");
			//console.log(error);
			expect(error.message).toContain(testCase.errorMsg);
			//console.log("After second expect");
		}
	}
});






test("db_ut_13", async () => {
	console.log("db_ut_13 1");
	const expected = [
		{ id: 1, name: "channel1", deleted: 0 },
		{ id: 2, name: "channel2", deleted: 0 },
		{ id: 3, name: "channel3", deleted: 0 },
		{ id: 4, name: "channel4", deleted: 0 },
		{ id: 5, name: "channel5", deleted: 0 },
	];
	const result = await queries.selectAllChannels(db.getConnection2());
	expect(result).toEqual(expected);

});



