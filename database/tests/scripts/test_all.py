import os
import pytest
import pymysql


# Define configuration variables
dbConfig = {
	"host": "testdb",
	"port": 3306,
	"user": "root",
	"database": "chatdb"
}

# Set up the environment
os.environ["MY_APP_ENV"] = "test"

# Start the database
@pytest.fixture(scope="module")
def db_connection():
	connection = None
	try:
		connection = pymysql.connect(
			host=dbConfig["host"],
			port=dbConfig["port"],
			user=dbConfig["user"],
			db=dbConfig["database"]
		)

	except pymysql.err.OperationalError as e:
		pytest.fail(f"Failed to establish a connection with the database: {e}")

	#check tables
	with connection.cursor() as cursor:
		cursor.execute("SHOW TABLES")
		actualTables = {row[0] for row in cursor.fetchall()}

	expectedTables = {"users", "channels", "messages"}
	assert actualTables == expectedTables, f"Unexpected tables in the database: {actualTables ^ expectedTables}"

	#check rows in all tables
	def get_row_count(table_name):
		with connection.cursor() as cursor:
			cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
			return cursor.fetchone()[0]

	assert get_row_count("users") == 5, "The users table should have 5 rows"
	assert get_row_count("channels") == 5, "The channels table should have 5 rows"
	assert get_row_count("messages") == 50, "The messages table should have 50 rows"

	yield connection

	connection.close()


# Run all tests
if __name__ == "__main__":
	pytest.main(["-v"])
