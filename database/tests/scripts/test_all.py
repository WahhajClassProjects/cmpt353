import os
import pytest
import pymysql


# Set up the environment
os.environ["MY_APP_ENV"] = "test"

# Start testdb1 which is for tests that need the starter test data
@pytest.fixture(scope="module")
def testdb1_connection():
	testdb1Connection = None
	try:
		testdb1Connection = pymysql.connect(
			host="testdb1",
			port=3306,
			user="root",
			db="chatdb"
		)

	except pymysql.err.OperationalError as e:
		pytest.fail(f"Failed to establish a connection with the database: {e}")

	#check tables
	with testdb1Connection.cursor() as cursor:
		cursor.execute("SHOW TABLES")
		actualTables = {row[0] for row in cursor.fetchall()}

	expectedTables = {"users", "channels", "messages"}
	assert actualTables == expectedTables, f"Unexpected tables in the database: {actualTables ^ expectedTables}"

	#check rows in all tables
	def get_row_count(table_name):
		with testdb1Connection.cursor() as cursor:
			cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
			return cursor.fetchone()[0]

	assert get_row_count("users") == 5, "The users table should have 5 rows"
	assert get_row_count("channels") == 5, "The channels table should have 5 rows"
	assert get_row_count("messages") == 50, "The messages table should have 50 rows"

	yield testdb1Connection

	testdb1Connection.close()


# Start testdb2 which is for tests that modify the database
@pytest.fixture(scope="module")
def testdb2_connection():
	testdb2Connection = None
	try:
		testdb2Connection = pymysql.connect(
			host="testdb2",
			port=3307,
			user="root",
			db="chatdb"
		)

	except pymysql.err.OperationalError as e:
		pytest.fail(f"Failed to establish a connection with the database: {e}")

	#check tables
	with testdb2Connection.cursor() as cursor:
		cursor.execute("SHOW TABLES")
		actualTables = {row[0] for row in cursor.fetchall()}

	expectedTables = {"users", "channels", "messages"}
	assert actualTables == expectedTables, f"Unexpected tables in the database: {actualTables ^ expectedTables}"

	#check rows in all tables
	def get_row_count(table_name):
		with testdb2Connection.cursor() as cursor:
			cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
			return cursor.fetchone()[0]

	assert get_row_count("users") == 5, "The users table should have 5 rows"
	assert get_row_count("channels") == 5, "The channels table should have 5 rows"
	assert get_row_count("messages") == 50, "The messages table should have 50 rows"

	yield testdb2Connection

	testdb2Connection.close()

# Run all tests
if __name__ == "__main__":
	pytest.main(["-v"])
