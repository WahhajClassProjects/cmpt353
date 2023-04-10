//dbConnections.js
// database connections that can be passed around to the tests

const mysql = require("mysql2/promise");

const db1Config = {
	host: "testdb1",
	user: "root",
	port: 3306,
	database: "chatdb"
}

const db2Config = {
	host: "testdb2",
	user: "root",
	port: 3306,
	database: "chatdb"
}

let connection1;
let connection2;

async function connect1(){
	let retries = 5;
	while(retries){
		try {
			connection1 = await mysql.createConnection(db1Config);
			//console.log("Connected to database 1");
			return connection1;
		}catch (error) {
			//console.log("Error connecting to database 1");
			retries--;
			//console.log(`Retries left: ${retries}`);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
	throw new Error("Failed to connect to database 1");

}

async function connect2() {
	let retries = 5;
	while (retries) {
		try {
			connection2 = await mysql.createConnection(db2Config);
			console.log("Connected to database 2");
			return connection2;
		} catch (error) {
			console.log("Error connecting to database 2");
			retries--;
			console.log(`Retries left: ${retries}`);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
	throw new Error("Failed to connect to database 2");
}
function getConnection1(){
	return connection1;
}
function getConnection2(){
	return connection2;
}

async function close1() {
	if (connection1) {
		await connection1.end();
		connection1 = null;
	}
}

async function close2() {
	if (connection2) {
		await connection2.end();
		connection2 = null;
	}
}

async function query1(sql, params) {
	if(!connection1){
		await connect1();
	}
	const [results] = await connection1.execute(sql, params);
	return results;
}

async function query2(sql, params) {
	if(!connection2){
		await connect2();
	}
	const [results] = await connection2.execute(sql);
	return results;
}

module.exports = {
	connect1,
	connect2,
	getConnection1,
	getConnection2,
	close1,
	close2,
	query1,
	query2,
};