from MQTTDatabase import MQTTDatabase
from AsyncMQTTClient import AsyncMQTTClient
from quart import request
import json

db = MQTTDatabase("my_mqtt.db")
mc = AsyncMQTTClient(db)

from quart import Quart

app = Quart(__name__)

@app.route('/')
async def hello():
    return 'hello'

@app.route("/in/MeshtasticSensors/config", methods=["POST"])
async def sendConfig():
    # print(request)
    data = await request.get_data()
    data = json.loads(data.decode("utf-8"))
    # print(data)
    mc.send_config("MeshtasticSensors/config", data["payload"])
    return "done", 200

@app.route("/out/sensors/all")
async def getAllData():
    return db.getAllData()

@app.route("/out/sensors/<attribute>")
async def getSensorData(attribute):
    return db.getDataByAttribute(attribute)

async def main():
    mqtt_task = asyncio.create_task(mc.run_async_loop())
    print("hello")

@app.before_serving
async def startup():
    app.add_background_task(mc.run_async_loop)

app.run(host="::", port=5000)

#db.closeConn()
