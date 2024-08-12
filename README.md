### Integrating a Raspberry Pi Pico with AREDN for Remote Data Logging

#### 1. Flashing the Pico with WizHat's MicroPython Port
To begin, flash your Raspberry Pi Pico with the MicroPython port provided by WizHat. This customized firmware is crucial for ensuring compatibility with the WizHat's hardware. Fortunately, you don't need to build the firmware from scratch; a [prebuilt release](https://github.com/Wiznet/RP2040-HAT-MicroPython/blob/main/Ethernet%20Example%20Getting%20Started%20%5BMicropython%5D.md#deploying-firmware-to-the-device) is provided by Wiznet, making the process straightforward.

One important note: I discovered that the HTTP server functionality did not work as expected on the Pico. Instead, when forwarding data, the Pico should act as an HTTP client. The best way to set this up is by using the `urequests.py` wrapper, which builds on top of the `requests` library. This wrapper addresses a few issues and provides a smoother experience. Additionally, it's commonly used with WizHat devices. Be sure to copy the `urequests.py` [file](https://github.com/Wiznet/RP2040-HAT-MicroPython/blob/main/examples/HTTP/HTTP_Client/urequests.py) to the root-level directory of the Pico.

#### 2. Setting Up the SPI Interface with the Heltec Meshtastic Device
Once the Pico is flashed, the next step is to configure the SPI interface to communicate with the Heltec Meshtastic device. The Pico automatically runs the `main.py` file upon powering up. Any data that can be loaded into the Pico’s memory can be forwarded, so you’re not limited to data received over SPI or UART.

In this setup, we utilized the RX/TX pins (0 and 1) to establish communication with the Meshtastic device.

See [the code]() for further detail.

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
   node build
   ```

The port will be specified later.

#### 5. Assigning a Static IP on the AREDN Node
Connect your Raspberry Pi to the AREDN mesh. When it connects to the AREDN node, it will appear on the DHCP setup page. Although DHCP is not used in this configuration, you can still force the MAC address of the Raspberry Pi to link to a specific IP address. This ensures that the Raspberry Pi will always be assigned the same static IP whenever it connects to the AREDN network.

After assigning the IP, you can also assign the Raspberry Pi a static hostname, such as `raspberrypi.local.mesh`. This makes the website accessible at `http://raspberrypi.local.mesh:PORT` instead of relying on an IP address.

However, it’s worth noting that the MikroTik routers connected to the AREDN network may not refresh their DNS frequently. This could cause delays in resolving the hostname to the correct IP address. A workaround is to power cycle the AREDN node to which your computer is connected.

#### 6. Configuring the Pico to Send Data to the Raspberry Pi
Due to the DNS limitations mentioned earlier, a more reliable approach is to connect directly via the IP address. Configure the Pico code to send its POST requests to this static IP, ensuring that the port number matches the port on which the Raspberry Pi's API is running. In this setup, we used port 3000.

#### 7. Connecting the Pico to Another Node in the AREDN Network
Given the DNS issues discussed, the most reliable method is to first initialize the API and connect the Raspberry Pi to the AREDN network. The server should not encounter any issues at this stage, as it isn’t dependent on an active connection. To initialize the Node.js server in the `AREDN_site` directory:

```bash
ORIGIN=http://hostname.local.mesh:PORT node build
```

Next, connect the Pico to its AREDN node. Since we’re using the direct IP address, the Pico should not be affected by DNS propagation delays. However, it may produce an error if the API endpoint is not accessible, so it’s recommended to initialize and connect the Raspberry Pi before the Pico.

Finally, connect your machine to its AREDN node. I found that it took about three minutes for the hostname to start resolving correctly. Nonetheless, the site should remain accessible via `http://IP:PORT`.
