# we are going to open up our own socket and listen over TCP
import socket
import time

# contains a helpful function that just drops the gibberish at the front
import aprs

import asyncio

class APRSListener:
    def __init__(self, HOST = "localhost", PORT=8001):
        self.HOST = HOST
        self.PORT = PORT
        self.socket = None

    def get_socket(self):
        return self.socket

    def connect(self):
        self.socket = connect_to_kiss_interface(self.HOST, self.PORT)
        self.socket.setblocking(False)

    async def listen(self, callback):# Main function
        # opening a socket if we haven't done so yet
        connect_to_kiss_interface(self.HOST, self.PORT) if self.get_socket() == None else ""

        if self.get_socket():
            try:
                await read_from_kiss_interface(self.get_socket(), callback)
            finally:
                self.get_socket().close()


def connect_to_kiss_interface(host: str, port: int):
    try:
        # Create a socket and connect to the KISS interface
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((host, port))
        print(f"Connected to KISS interface on {host}:{port}.")
        return sock
    except Exception as e:
        print(f"Error connecting to KISS interface: {e}")
        return None

async def read_from_kiss_interface(sock, callback):
    try:
        while True:
            data = False
            try:
                data = sock.recv(1024)  # Adjust buffer size as needed
            except BlockingIOError as e:
                pass
            if data:
                # the first and last bytes throw this function off
                data = data[1:-1]

                data = aprs.functions.parse_frame(data)

                callback(data)
            await asyncio.sleep(1)  # Adjust the sleep time as needed
    except KeyboardInterrupt:
        print("Terminating connection...")
    finally:
        sock.close()

