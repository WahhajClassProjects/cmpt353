const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.status(200)
        .setHeader("Content-Type", "application/json")
        .json({message: "Hello! You have reach the home page of the application. This page will have sign in and sign up features later!"});

})

module.exports = router;