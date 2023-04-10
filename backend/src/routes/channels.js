//routes which handles CRUD for channels. Update not implemented
const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");
const queries = require("../utils/dbQueries");

//get all channels
router.get("/", async (req, res) => {
	try{
		console.log("getting all channels")
		const result = await queries.selectAllChannels(db.getConnection());
		console.log(result);
		res.status(200)
		.json(result);
	} catch (error) {
		console.error(error);
		res.status(500)
			.json({message: "Error retrieving channels."});
	}
});

//get channel by id
router.get("/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const result = await queries.selectChannelById(db.getConnection(), req.params.id);
		if (result.length > 0) {
			res.status(200).json(result[0]);
		} else {
			res.status(404).json({ message: "Channel not found." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error retrieving channel." });
	}
});

//delete channel
router.delete("/:id", async (req, res) => {
	try {
		const result = await queries.deleteChannelbyID(db.getConnection(),req.params.id);
		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({ message: "Channel not found." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error deleting channel." });
	}
});

// create new channel
router.post("/", async (req, res) => {
	try {
		console.log("Request body:", req.body); // Add this line for debugging
		const result = await queries.insertChannel(db.getConnection(), req.body.name);
		res.status(201).json({ message: "Channel created successfully", id: result.insertId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating channel." });
	}
});

module.exports = router;