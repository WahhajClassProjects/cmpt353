// Main file for the backend
const PORT = process.env.PORT || 3001;
const app = require("express")();
const db = require("./src/utils/dbConnection");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());




//start database
db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database', err));

//routers
const home = require("./src/routes/home");
const channels = require("./src/routes/channels");
const messages = require("./src/routes/messages");
const auth = require("./src/middleware/auth");

app.use("/", home);
app.use("/channels", auth, channels);
app.use("/messages", auth, messages)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;

