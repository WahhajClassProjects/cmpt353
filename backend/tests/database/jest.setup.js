// jest.setup.js
const db = require('./dbConnections'); // Replace this with your actual database module
jest.setTimeout(200000);

//let db1Connection;
let db2Connection;

beforeAll(async () => {
	await db.connect1();
	await db.connect2();
});

afterAll(async () => {
	await db.close1();
	await db.close2();

});

/*beforeEach(async () => {
	await db1Connection.beginTransaction();
	await db2Connection.beginTransaction();
});

afterEach(async () => {
	await db1Connection.rollback();
	await db2Connection.rollback();
});*/
