import sqlite3
from datetime import datetime, timezone

# a class to manage the database.. everything in here should be sync: proper way to manage sqlite3

class APRSDatabase:
    def __init__(self, db_name: str):
        self.name = db_name
        self.cursor = None
        self.conn = None

        self.setupDB()

    def getName(self):
        return self.name

    def setConn(self, conn):
        self.conn = conn
    def getConn(self):
        return self.conn

    def setCursor(self, cursor):
        self.cursor = cursor
    def getCursor(self):
        return self.cursor

    def setupDB(self):
        self.setConn(sqlite3.connect(self.getName()))
        self.setCursor(self.getConn().cursor())

        self.getCursor().execute("""CREATE TABLE IF NOT EXISTS aprs_data
                 (callsign, transmission, temperature, pressure, voltage, satellite, timestamp)""")

    # the payload should be callsign;transmission_num;temp;pressure;voltage;satellites
    def addToDB(self, payload: str):
        # splitting up the input string
        payload = payload.split(";")

        # inserting into the table (db)
        self.getCursor().execute(
                "INSERT INTO aprs_data VALUES ({}, '{}')".format(
                    ",".join(["'" + str(d) + "'" for d in payload]), # expanding all the data and inserting it
                    datetime.now(timezone.utc).timestamp() # adding the timestamp
                    ) # end format
                ) # end execute

        # saving changes
        self.getConn().commit()

    def closeConn(self):
        self.getConn().close()

    def getDataByCallsign(self, call):
        # Define the SQL query
        query = "SELECT * FROM aprs_data WHERE callsign = ?"

        # Execute the query with the callsign as a parameter
        self.getCursor().execute(query, (call,))

        # Fetch all the matching rows
        rows = self.getCursor().fetchall()

        return rows

    def getAllData(self):
        self.getConn().row_factory = row_to_dict
        result = self.getConn().execute("SELECT * FROM aprs_data")
        return result.fetchall()

# when processing the getDataByAttribute response in JS it's different than expected, so I'm going to do the conversion here this time
def row_to_dict(cursor: sqlite3.Cursor, row: sqlite3.Row) -> dict:
        data = {}
        for idx, col in enumerate(cursor.description):
            data[col[0]] = row[idx]
        return data

