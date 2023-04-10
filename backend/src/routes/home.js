const express = require("express");
const router = express.Router();
const db = require("../utils/dbConnection");
const queries = require("../utils/dbQueries");
const jwt = require("jsonwebtoken");

router.get("/", (req,res) => {
    res.status(200)
        .setHeader("Content-Type", "application/json")
        .json({message: "Hello! You have reach the home page of the application. Sign in or Sign up!"});

});

router.post("/signin", async (req, res) => {
    try {
        const { id, password } = req.body;
        const [user] = await queries.selectUserById(db.getConnection(), id);

        if (user && user.password === password) {
            const secretKey = "HARDCODED_SECRET_KEY";
            const token = jwt.sign({ id }, secretKey, { expiresIn: "1h" });
            res.status(200).json({ message: "Sign in successful.", user, token });
        } else {
            res.status(401).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing in." });
    }
});

// Create a new account
router.post("/signup", async (req, res) => {
    try {
        const { id, password, name, isAdmin } = req.body;
        console.log(req.body)
        const [existingUser] = await queries.selectUserById(db.getConnection(), id);

        if (existingUser) {
            res.status(409).json({ message: "Username already exists." });
        } else {
            await queries.insertUser(db.getConnection(), id, password, name, 0);
            res.status(201).json({ message: "Account created successfully." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating account." });
    }
});

module.exports = router;