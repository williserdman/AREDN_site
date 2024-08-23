## Integrating a Raspberry Pi Pico with AREDN for Remote Data Logging

### Part 1: The website

#### 1. Flashing the Pico with WizHat's MicroPython Port

To begin, flash your Raspberry Pi Pico with the MicroPython port provided by WizHat. This customized firmware is crucial for ensuring compatibility with the WizHat's hardware. Fortunately, you don't need to build the firmware from scratch; a [prebuilt release](https://github.com/Wiznet/RP2040-HAT-MicroPython/blob/main/Ethernet%20Example%20Getting%20Started%20%5BMicropython%5D.md#deploying-firmware-to-the-device) is provided by Wiznet, making the process straightforward.

One important note: I discovered that the HTTP server functionality did not work as expected on the Pico. Instead, when forwarding data, the Pico should act as an HTTP client. The best way to set this up is by using the `urequests.py` wrapper, which builds on top of the `requests` library. This wrapper addresses a few issues and provides a smoother experience. Additionally, it's commonly used with WizHat devices. Be sure to copy the `urequests.py` [file](https://github.com/Wiznet/RP2040-HAT-MicroPython/blob/main/examples/HTTP/HTTP_Client/urequests.py) to the root-level directory of the Pico.

#### 2. Setting Up the SPI Interface with the Heltec Meshtastic Device

Once the Pico is flashed, the next step is to configure the SPI interface to communicate with the Heltec Meshtastic device. The Pico automatically runs the `main.py` file upon powering up. Any data that can be loaded into the Pico’s memory can be forwarded, so you’re not limited to data received over SPI or UART.

In this setup, we utilized the RX/TX pins (0 and 1) to establish communication with the Meshtastic device.

See [the code](https://github.com/williserdman/AREDN_site/tree/main/pico_code) for further details.

#### 3. Sending HTTP Requests Using `urequests.py`

After configuring the SPI interface, you can use the `urequests.py` module to send HTTP requests. This module allows the Pico to communicate with other devices over the network. Configure the Pico to send HTTP POST requests to a specific IP address where your server will be listening.

#### 4. Setting Up the Raspberry Pi API

Switching to the Raspberry Pi (in this case, an RPi 5), you’ll need to set up an API that can accept and process the POST requests sent by the Pico. This API should be designed to log incoming data into a database for storage and analysis.

For this project, we used a Node.js backend integrated into an AREDN website. However, a simpler solution like a Flask server would also work for logging the data.

To set up the API:

1. Navigate to an empty folder on your Raspberry Pi.
2. Clone the AREDN site repository:
   ```bash
   git clone https://github.com/williserdman/AREDN_site
   cd AREDN_site
   ```
3. Install the required Node packages:
   ```bash
   npm install
   ```
4. Build the site:
   ```bash
   npm run build
   ```

The port will be specified later.

#### 5. Assigning a Static IP on the AREDN Node

Connect your Raspberry Pi to the AREDN mesh. When it connects to the AREDN node, it will appear on the DHCP/setup page. Although DHCP is not used in this configuration, you can still force the MAC address of the Raspberry Pi to link to a specific IP address. This ensures that the Raspberry Pi will always be assigned the same static IP whenever it connects to the AREDN network.

After assigning the IP, you can also assign the Raspberry Pi a static hostname, such as `raspberrypi.local.mesh`. This makes the website accessible at `http://raspberrypi.local.mesh:PORT` instead of relying on an IP address. Typically port `80` is the default HTTP port (to access `http://raspberrypi.local.mesh`).

However, it’s worth noting that the MikroTik routers connected to the AREDN network may not refresh their DNS frequently. This could cause delays in resolving the hostname to the correct IP address. A workaround is to power cycle the AREDN node to which your computer is connected once the Raspberry Pi is connected to the mesh.

#### 6. Configuring the Pico to Send Data to the Raspberry Pi

Due to the DNS limitations mentioned earlier, a more reliable approach is to connect directly via the IP address. ~~Configure the Pico code to send its POST requests to this static IP, ensuring that the port number matches the port on which the Raspberry Pi's API is running.~~ The most recent version uses MQTT (see part 2 for setup) In this setup, we used port 3001.

#### 7. Connecting the Pico to Another Node in the AREDN Network

Given the DNS issues discussed, the most reliable method is to first initialize the API and connect the Raspberry Pi to the AREDN network. The server should not encounter any issues at this stage, as it isn’t dependent on an active connection. To initialize the Node.js server in the `AREDN_site` directory:

```bash
node runserver
```

Next, connect the Pico to its AREDN node. Since we’re using the direct IP address, the Pico should not be affected by DNS propagation delays. However, it may produce an error if the API endpoint is not accessible, so it’s recommended that the Raspberry Pi be initialized and connected (to AREDN) before the Pico.

Finally, connect your machine to its AREDN node. I found that it took about three minutes for the hostname to start resolving correctly. Nonetheless, the site should remain accessible via `http://RASPBERRYPI_IP:PORT`.

#### Steps 1, 2, 3, 6, and 7 can be repeated to add additional forwarding nodes.

#### 8. Adding the webserver to be a systemd service

Most Linux systems nowadays use a process manager, systemd. This will allow us to spin up the website any time our machine starts/reboots. This code is for a Raspberry Pi (5) but similar steps could be achieved with another Linux (Debian) system.

In my `/etc/systemd/system/arednapp.service` I have:

```bash
[Service]
type=simple
Description=Node.js App for AREDN (and Cloudflare Tunnel)
WorkingDirectory=/home/pi/Documents/AREDN_site
ExecStart=/usr/bin/node /home/pi/Documents/AREDN_site/runserver.js
Restart=on-failure
Environment=NODE_ENV=production
# EnvironmentFile=/etc/app.env

[Install]
WantedBy=multi-user.target
```

To add this as a service, let's first make sure the daemon sees it:
`sudo systemctl daemon-reload`

Then finally let's enable the service:
`sudo systemctl enable --now arednapp.socket`

#### About ORIGINs and multiple domains
The web server is currently designed to be accessible both on the AREDN network and the regular internet. The effect of this is that the domain's origin can be either `aredn-side-on-regular-internet.com` or `hostname.local.mesh`. This is a somewhat uncommon occurrence so special steps have been taken for functionality of the forms to function properly. Origins, where you want the config forms to work properly, should be added to the file `runserver.js`. Similarly, the port can also be specified in this file. 

### Part 2: MQTT Broker and Database
By now you should have a website that's up and running on 0.0.0.0:3001 or some other port you used. However, when you try to access this website you'll likely realize that it tells you that the requested resource can't be found. That's because we haven't fully set up our backend with uses MQTT. 

#### Setting up the MQTT Broker
This should be set up and running before the Pico is connected to the AREDN network. We used [Eclipse Mosquitto™](https://mosquitto.org/), but in theory, MQTT Broker should work. This was installed through `sudo apt install mosquitto`. * mosquitto now mosquito. After installation follow the instructions. The Broker should add itself as a systemd service running on port 1883.

The MQTT service works with a spoke-hub setup, it all runs from this central broker. What's interesting and different from an HTTP server is there's no easy way to interface with the server. Each Pico connected to this Broker is a client and they will be posting their data by default to the channel `MeshtasticSensors/data`. In addition, they will get all messages to the channel `MeshtasticSensors/config`. While we can't interface with the central Broker directly we can add a client that runs on the same machine as the Broker. This client will act as the bridge between the MQTT network that's running with the sensors and our web server. For simplicity, the database was also moved to be managed by the MQTT client script. 

So let's get this running. Navigate to the `pythonMQTT` folder. Let's create a virtual environment and install the required packages.

`python -m venv .venv`
`source .venv/bin/activate`
`pip install -r requirements.txt`

We can test this by running `python main.py`. This is running on port 5000 by default. Now, we can connect to the Broker using the Pico and log incoming data to our database. Furthermore, as the bridge is now up and running the website will be able to resolve requests. Importantly, we've not yet set this up as a systemd service, so once the terminal session ends the bridge will terminate with it. 

We are going to follow a similar process as above to run this bridge. We will add it as a system service. The only change is our run command will switch from `python main.py` to `hypercorn main` which is a production-ready implementation of our service. 

Here's our `/etc/systemd/system/mqttbridge.service`:
```bash
[Service]
Type=simple
WorkingDirectory=/home/pi/Documents/pythonMQTT
ExecStart=/home/pi/Documents/pythonMQTT/.venv/bin/hypercorn /home/pi/Documents/pythonMQTT/main.py
KillSignal=SIGINT
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then again lets get this service to run on boot:
`sudo systemctl daemon-reload`
`sudo systemctl enable --now mqttbridge.service` 

The `--now` flags turn this on immediately. So we should see that our website, MQTT bridge, and MQTT broker are fully functional. The website should always now display the data from the MQTT bridge's database. We can now connect as many Pico's as we would like and their data will be logged. Our site should be accessible over AREDN at hostname.local.mesh.

#### Part 3: Tunneling to the regular internet
It was in our interest to serve a copy of this website on the regular internet. Onboard the Raspberry Pi there are multiple different network interfaces. When the RaspberryPi recieves a request on one of the networks it'll respond using that network. By default, outbound connections are routed through the interface with the lower `metric`. When we had our RaspberryPi connected to the AREDN network over `eth0` it would default to this instead of the actual internet connection over `wlan0`. 

To see the metrics of your devices:

`route -n`

* The Iface with the lowest metric will be prioritized
* We wanted to lower the metric of wlan0 such that it'll be the default, we will still be able to respond to requests on AREDN as expected

The steps may vary across devices. RaspberryPi recently switched to using NetworkManager so these are the steps we needed to follow to get it working. Setting priority network interface with NetworkManager:
1. `nmcli connection`... find and node the `NAME` for the `DEVICE` whose metric we want to change
2. `sudo nmcli connection modify "NAME" ipv4.route-metric METRIC_NUMBER`
* for us `sudo nmcli connection modify "Wifi SSID" ipv4.route-metric 10`
3. Then finally: `sudo systemctl restart NetworkManager`
([thanks](https://dev.to/emamirazavi/how-to-set-metric-in-networkmanager-system-4525))

Then to tunnel we used [Cloudflare's Tunnel service](https://www.cloudflare.com/products/tunnel/) this is a free solution that allowed up to forward port 3001 on the RaspberryPi to be proxied by Cloudflare and served on a domain. This also helped us get around a NAT that would otherwise block inbound traffic. 
