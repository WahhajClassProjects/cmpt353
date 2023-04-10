// dbConnection.js
// database connection for the application

const mysql = require("mysql2/promise");

// database connection functions
const connectionConfig = {
	host: process.env.DB_HOST,
	user: "root",
	port: 3306,
	database: "chatdb"
};

let connection;

async function connect(){
	let retries = 5;
	while(retries){
		try {
			connection = await mysql.createConnection(connectionConfig);
			console.log("Connected to the database");
			return connection;
		}catch (error) {
			console.log("Error connecting to the database");
			retries--;
			console.log(`Retries left: ${retries}`);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
	throw new Error("Failed to connect to the database");

}

function getConnection(){
	return connection;
}

async function close() {
	if (connection) {
		await connection.end();
		connection = null;
	}
}

module.exports = {connect, getConnection, close}




