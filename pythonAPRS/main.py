from APRSListener import APRSListener
from APRSDatabase import APRSDatabase
import asyncio
import re
from quart import Quart

client = APRSListener()
client.connect()
db = APRSDatabase("my-aprs.db")

def p(x):
    print(x)
    # Regular expression pattern to match the desired parts
    pattern = r"(\w+-\d+).*? (\d+TxC)  (-?\d+\.\d+C) (\d+\.\d+hPa)  (-?\d+\.\d+V) (\d{2})"

    # Find matches using the regular expression
    match = re.search(pattern, str(x))

    if match:
        call = match.group(1)
        txc = match.group(2)
        temperature = match.group(3)
        pressure = match.group(4)
        voltage = match.group(5)
        s_value = match.group(6)

        print("Callsign:", call)
        print("TxC:", txc)
        print("Temperature:", temperature)
        print("Pressure:", pressure)
        print("Voltage:", voltage)
        print("S Value:", s_value)

        db.addToDB(f"{call};{txc};{temperature};{pressure};{voltage};{s_value}")
    else:
        print("No match found.")

async def listen():
    await client.listen(p)

app = Quart(__name__)

@app.route("/out/all")
async def getAllData():
    return db.getAllData()

@app.route("/out/callsign/<call>")
async def getSensorData(call):
    call = call.upper()
    return db.getDataByCallsign(call)

@app.before_serving
async def startup():
    app.add_background_task(listen)

app.run(host="::", port=5001)
# app.run(host="::", port=5001)
