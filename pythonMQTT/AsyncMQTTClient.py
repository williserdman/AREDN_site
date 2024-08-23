import paho.mqtt.client as mqtt
import MQTTDatabase
import asyncio

class AsyncMQTTClient:
    def __init__(self, db: MQTTDatabase.MQTTDatabase, hostname: str = "localhost", port: int = 1883):
        self.db = db

        self.mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.mqttc.on_connect = self.on_connect
        self.mqttc.on_message = self.on_message

        self.mqttc.connect(hostname, port, 60)


    def update_mqttc(self):
        self.mqttc.loop_read()
        self.mqttc.loop_write()
        self.mqttc.loop_misc()

    async def run_async_loop(self):
        while True:
            self.update_mqttc()
            await asyncio.sleep(0.2)

    def getClient(self):
        return self.mqttc

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self, client, userdata, flags, reason_code, properties):
        print(f"Connected with result code {reason_code}")

        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        client.subscribe("MeshtasticSensors/data")

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        # payload is sent as a bytestring
        decoded_string = msg.payload.decode("utf-8")

        print(msg.topic + ": " + decoded_string)

        try:
            self.db.addToDB(decoded_string) # sometimes the data sends two at once, which is problematic, lowered sleep time to avoid
        except:
            print("ERROR: two messages recieved at the same time")
        return

    def send_config(self, topic: str, toSend: str) -> None:
        self.getClient().publish(topic, toSend)
        return

