import pymysql
import pytest
from test_all import db_connection

def test_db_unit_test_1(db_connection):

	assert db_connection is not None, "Failed to establish a connection with the database"
