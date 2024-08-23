import sqlite3
from datetime import datetime, timezone

# a class to manage the database.. everything in here should be sync: proper way to manage sqlite3

class MQTTDatabase:
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

        self.getCursor().execute("""CREATE TABLE IF NOT EXISTS sensordata
                 (sensor_id, temperature, humidity, co2, temp2, hum2, pressure, altitude, gas, timestamp)""")

    def addToDB(self, payload: str):
        # splitting up the input string
        payload = payload.split(";")

        # inserting into the table (db)
        self.getCursor().execute(
                "INSERT INTO sensordata VALUES ({}, '{}')".format(
                    ",".join(["'" + str(d) + "'" for d in payload]), # expanding all the data and inserting it
                    datetime.now(timezone.utc).timestamp() # adding the timestamp
                    ) # end format
                ) # end execute

        # saving changes
        self.getConn().commit()

    def closeConn(self):
        self.getConn().close()

    def getDataByAttribute(self, attribute_name):
        res = self.getCursor().execute(f"SELECT sensor_id, {attribute_name}, timestamp FROM sensordata")
        return res.fetchall()

    def getAllData(self):
        self.getConn().row_factory = row_to_dict
        result = self.getConn().execute("SELECT * FROM sensordata")
        return result.fetchall()

# when processing the getDataByAttribute response in JS it's different than expected, so I'm going to do the conversion here this time
def row_to_dict(cursor: sqlite3.Cursor, row: sqlite3.Row) -> dict:
        data = {}
        for idx, col in enumerate(cursor.description):
            data[col[0]] = row[idx]
        return data

