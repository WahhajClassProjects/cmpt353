//routes which handles CRUD for messages. Update not implemented
const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");
const queries = require("../utils/dbQueries");


//get all messages for channel
router.get("/channel/:id", async (req, res) => {
	try{
		const result = await queries.selectMessagesByChannel(db.getConnection(), req.params.id);
		res.status(200)
			.json(result);
	} catch (error) {
		console.error(error);
		res.status(500)
			.json({message: "Error retrieving messages."});
	}
});

//get message by id
router.get("/message/:id", async (req, res) => {
	console.log("Getting message by id 1");
	try {
		console.log("Getting message by id 1");
		const result = await queries.getMessageByID(db.getConnection(), req.params.id);
		console.log("Got message by id 1");
		console.log(result);
		if (result.length > 0) {
			res.status(200).json(result[0]);
		} else {
			res.status(404).json({ message: "message not found." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error retrieving message." });
	}
});

//delete message by id
router.delete("/message/:id", async (req, res) => {
	try {
		const result = await queries.deleteMessageByID(db.getConnection(),req.params.id);
		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({ message: "message not found." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error deleting message." });
	}
});

// create message
router.post("/", async (req, res) => {
	try {
		console.log("***********Creating new Message***********")
		console.log(req.body);
		const { channelID, senderID, timestamp, parentID, thumbsUpCount, thumbsDownCount, body } = req.body;
		const result = await queries.insertMessage(db.getConnection(), channelID, senderID, Date.now(), parentID, thumbsUpCount, thumbsDownCount, body );
		const newMessageID = result.insertId;
		const createdMessage = await queries.getMessageByID(db.getConnection(), newMessageID);
		res.status(201).json(createdMessage[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error creating message." });
	}
});



module.exports = router;