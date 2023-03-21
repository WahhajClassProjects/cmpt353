// Main file for the backend
const PORT = process.env.PORT || 3001;
const express = require("express");
const app = express();

//routers
const helloRouter = require("./src/routes/hello")

app.get("/", (req, res) => {
  res.json({message: "Hello. You have reach the main page."});
});

app.use("/hello", helloRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

