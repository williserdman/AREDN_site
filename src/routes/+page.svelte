<svelte:head>
	<title>KO4TL/Mendez Lab - PSU MCECS</title>
</svelte:head>

<main class="container">
	<section class="section">
		<h1 class="title">Environmental Monitoring with AREDN, APRS, and MQTT</h1>
		<div class="content">
			<h2 class="title is-4">Project Overview</h2>
			<p>
				This project focuses on leveraging AREDN (Amateur Radio Emergency Data Network) and APRS
				(Automatic Packet Reporting System) for comprehensive environmental monitoring. By
				integrating these technologies with IoT protocols and MQTT (Message Queuing Telemetry
				Transport), a lightweight messaging protocol that's primarily used for machine-to-machine
				(M2M) communication and Internet of Things (IoT) connections. We created a robust system for
				remote data collection and transmission.
			</p>

			<h2 class="title is-5">AREDN and APRS Integration</h2>
			<p>
				AREDN provides a mesh network framework that enhances communication during emergencies by
				establishing reliable and self-healing networks. APRS enables real-time data reporting,
				including environmental parameters such as temperature, humidity, and atmospheric pressure.
				Together, these technologies offer a resilient infrastructure for transmitting critical data
				across dispersed locations.
			</p>

			<h2 class="title is-5">MQTT Protocol for IoT Communication</h2>
			<p>
				MQTT, a lightweight messaging protocol for small sensors and mobile devices, plays a crucial
				role in this project. It facilitates efficient communication between devices by providing a
				publish/subscribe mechanism, which reduces the overhead associated with direct
				device-to-device communication. This protocol is integral to managing data flow between
				environmental sensors and the central server.
			</p>

			<h2 class="title is-5">System Architecture</h2>
			<p>The system architecture involves several key components:</p>
			<ul>
				<li>
					<strong>Sensor Nodes:</strong> Equipped with environmental sensors and communication modules,
					these nodes collect data and transmit it via the Meshtastic network.
				</li>
				<li>
					<strong>Gateway Nodes:</strong> Interface with the AREDN network and forward data to the central
					server using MQTT.
				</li>
				<li>
					<strong>Central Server:</strong> Receives and processes data from sensor nodes, providing a
					web interface for monitoring and analysis.
				</li>
				<li>
					<strong>Web Interface:</strong> Displays real-time data and visualizations, allowing users
					to interact with the collected information.
				</li>
			</ul>

			<h2 class="title is-5">Future Directions</h2>
			<p>
				The ongoing development of this project aims to enhance the system's capabilities by
				integrating additional sensor types, improving data accuracy, and expanding the network's
				reach. Future work will also focus on optimizing the communication protocols and ensuring
				the robustness of the system under various environmental conditions.
			</p>
		</div>
	</section>
</main>
