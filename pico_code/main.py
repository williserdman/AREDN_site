from usocket import socket
from machine import Pin, SPI, UART

# ensure that the urequests.py file is in the root directory of the pico
import urequests
import network
import time
import random

# The meshtastic boot sequence took roughly 30 seconds. When they powered on at the same time the Pico ran before the Heltec was ready. This threw an error when attempting connection over UART.
time.sleep(30)

# Initializing the W5x00 chip (ethernet). Pins 16-20 are in use!
def w5x00_init():
    spi=SPI(0,2_000_000, mosi=Pin(19),miso=Pin(16),sck=Pin(18))
    nic = network.WIZNET5K(spi,Pin(17),Pin(20)) #spi,cs,reset pin
    nic.active(True)
        
    # if using DHCP... our AREDN node was not configured to use DHCP
    #nic.ifconfig('dhcp')
    print('IP address :', nic.ifconfig())
    
    # Waiting for the device to initialize.
    while not nic.isconnected():
        time.sleep(1)

# Connecting to the Heltec device
uart = UART(0, baudrate=115200, tx=Pin(0), rx=Pin(1))
uart.init(115200, bits=8, parity=None, stop=1)

# Helper function to process the string recieved from the Heltec
def process_toms_input(data: string):
    data = data.replace("\r\n", " ").replace(":", "").strip()
    data = data.split(" ")
    print(data)
    data = [x.strip() for x in data]
    return data

# Function that crafts the post request we want to send. Takes in the data.
def post_request(sensor_id, temp, hum, co2, temp2, hum2, pressure, altitude, gas):
    
    # We are going to initialize a request and save the variable so we can listen for a response
    # First argument is the API endpoint
    r = urequests.post('http://mysite.local.mesh:3000/api',
                       
                       # This is not a security measure. While there may be possibilities of having higher level verification https://rietta.com/blog/authentication-without-encryption-for/
                       # All these headers do it prevent unintentional post requests.
                       
                       headers={"Authorization": "willis_is_cool"},
                       
                       # The data is just sent as json. As long as the server is expecting the change more variables can be added/removed as needed. 
                       json={
                           "sensorID": sensor_id,
                           "CO2": co2,
                           "temperature": temp,
                           "humidity": hum,
                           "temp2": temp2,
                           "hum2": hum2,
                           "pressure": pressure,
                           "altitude": altitude,
                           "gas": gas})
    
    if not r:
        # We expect some form of acknowledgement from the server. This could be an opportunity to resend if something fails.
        print('spreadsheet: no response received')
    
    # Now to decode the response. Here there is the option to pass something like config values and do something with those. 
    print(r.content.decode("utf-8"))
    
    # Closing the connection
    r.close()

# Entry
def main():
    # Initializing the ethernet port
    w5x00_init()
    
    print("listening to serial")
    while True:
        
        # When there is data in the UART buffer then this runs.
        if (uart.any() > 0):
            try:
                # We can read the data in the buffer in as a string.
                in_string = uart.read().decode("utf-8")
                
                # Pythonic string processing
                processed = process_toms_input(in_string)
                
                # Sending that data to our endpoint.
                post_request(*processed)
            except:
                continue
    
    # essentially reboots (memory not preserved with deepsleep)
    # machine.lightsleep (preserves memory state) also exists, on some machines, unclear if Pico is one of them 
    # machine.deepsleep("""time sleeping in milliseconds""") 

# When the pico is plugged in the main.py file will run. This is our entrypoint.
if __name__ == "__main__":
    main()
