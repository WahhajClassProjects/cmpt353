import pymysql
import pytest
from test_all import testdb2_connection

def test_db_unit_test_1(testdb1_connection, testdb2_connection):

	assert testdb1_connection is not None, "Failed to establish a connection with the database testdb1"
	assert testdb2_connection is not None, "Failed to establish a connection with the database testdb2"

