//auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the header

  try {
    const secretKey = "HARDCODED_SECRET_KEY"; // Replace with your secret key
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error validating token:", token); // Log the token for debugging
    console.log("Error message:", error.message); // Log the error message for debugging

    res.status(400).json({ message: "Token is not valid." });
  }
}

module.exports = auth;