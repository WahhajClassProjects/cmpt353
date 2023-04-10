// backend unit tests
const request = require("supertest");
const app = require("../../index");
const db = require("../../src/utils/dbConnection");
//jest.setTimeout(200000);

describe("Database unit tets", ()=> {
	beforeAll(async () => {
		await db.connect();
	});

/*
//check to see if the home page is accessible
	test("be_ut_1", async () =>{
		const res = await request(app).get("/");
		expectedRes = {message: "Hello! You have reach the home page of the application. This page will have sign in and sign up features later!"};
		expect(res.headers["content-type"]).toMatch("application/json");
		expect(res.body.message).toBe("Hello! You have reach the home page of the application. This page will have sign in and sign up features later!");

	});


	//get all channels
	test("be_ut_2", async () => {
		expectedRes = [
			{id: 1, name: "channel1", deleted: 0},
			{id: 2, name: "channel2", deleted: 0},
			{id: 3, name: "channel3", deleted: 0},
			{id: 4, name: "channel4", deleted: 0},
			{id: 5, name: "channel5", deleted: 0}
		]
		const res = await request(app).get("/channels")
		expect(res.status).toBe(200);
		expect(res.headers["content-type"]).toMatch("application/json");
		expect(res.body).toEqual(expectedRes);
	});

	//get one channel by id
	test("be_ut_3", async () => {
		expectedRes = {id: 1, name: "channel1", deleted: 0};

		const res = await request(app).get("/channels/1")
		expect(res.status).toBe(200);
		expect(res.headers["content-type"]).toMatch("application/json");
		expect(res.body).toEqual(expectedRes);
	});

	//delete a channel
	test("be_ut_4", async () => {
		expectedRes = {id: 1, name: "channel1", deleted: 1};

		let res = await request(app).delete("/channels/1")
		expect(res.status).toBe(204);

		res = await request(app).get("/channels/1");
		expect(res.status).toBe(200);
		expect(res.body).toEqual(expectedRes);
	});




	//get all messages for channel
	test("be_ut_5", async () => {
		expectedRes = [
			{id: 28, channelID: 4, senderID: "u1", timestamp: 1.65042E+12, parentID: 0, thumbsUpCount: 104, thumbsDownCount: 148, body: "Seamless bi-directional portal", deleted: 0},
			{id: 32, channelID: 4, senderID: "u2", timestamp: 1.65059E+12, parentID: 0, thumbsUpCount: 17, thumbsDownCount: 153, body: "Focused grid-enabled attitude", deleted: 0},
			{id: 40, channelID: 4, senderID: "u3", timestamp: 1.65085E+12, parentID: 0, thumbsUpCount: 82, thumbsDownCount: 194, body: "Up-sized user-facing parallelism", deleted: 0},
			{id: 43, channelID: 4, senderID: "u1", timestamp: 1.65092E+12, parentID: 0, thumbsUpCount: 120, thumbsDownCount: 114, body: "Object-based eco-centric framework", deleted: 0},
			{id: 49, channelID: 4, senderID: "u3", timestamp: 1.65109E+12, parentID: 0, thumbsUpCount: 190, thumbsDownCount: 108, body: "Synergized modular ability", deleted: 0},
		]
		const res = await request(app).get("/messages/channel/4")
		expect(res.status).toBe(200);
		expect(res.headers["content-type"]).toMatch("application/json");
		expect(res.body).toEqual(expectedRes);
	});

	//get one messages by id
	test("be_ut_6", async () => {
		expectedRes = {id: 1, channelID: 1, senderID: "u1", timestamp: 1.64914E+12, parentID: 0, thumbsUpCount: 25, thumbsDownCount: 66, body: "Secured local challenge", deleted: 0};

		const res = await request(app).get("/messages/message/1")
		expect(res.status).toBe(200);
		expect(res.headers["content-type"]).toMatch("application/json");
		expect(res.body).toEqual(expectedRes);

	});

	//delete a message
	test("be_ut_7", async () => {
		expectedRes = 	{id: 49, channelID: 4, senderID: "u3", timestamp: 1.65109E+12, parentID: 0, thumbsUpCount: 190, thumbsDownCount: 108, body: "Synergized modular ability", deleted: 1};

		let res = await request(app).delete("/messages/message/49")
		expect(res.status).toBe(204);

		res = await request(app).get("/messages/message/49");
		expect(res.status).toBe(200);
		expect(res.body).toEqual(expectedRes);
	});
*/


	// create channel test
	test("be_ut_7: create channel", async () => {
		const res = await request(app)
			.post("/channels")
			.send({ name: "Test Channel" })
			.set("Accept", "application/json");

		expect(res.status).toBe(201);
		expect(res.body.message).toBe("Channel created successfully");
	});

// create message test
	test("be_ut_8: create message", async () => {
		const res = await request(app)
			.post("/messages")
			.send({
				channelID: 4,
				senderID: "u1",
				timestamp: new Date().getTime(),
				parentID: 0,
				thumbsUpCount: 0,
				thumbsDownCount: 0,
				body: "Hello, world!",
				deleted: 0,
			})
			.set("Accept", "application/json");

		expect(res.status).toBe(201);
		expect(res.body.channelID).toBe(4);
		expect(res.body.senderID).toBe("u1");
		expect(res.body.timestamp).not.toBeNaN();
		expect(res.body.parentID).toBe(0);
		expect(res.body.thumbsUpCount).toBe(0);
		expect(res.body.thumbsDownCount).toBe(0);
		expect(res.body.body).toBe("Hello, world!");
		expect(res.body.deleted).toBe(0);
	});




});




