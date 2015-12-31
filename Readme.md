## Google Maps on a Raspberry PI in a car

Ingredients:

*    Raspberry PI (any version) running raspbian
*    In-car video screen with composite video input
*    Bluetooth GPS receiver
*    Internet link from the car
*    Server to hold location information, zones to trigger behaviour, etc

Google maps with traffic information can then be displayed easily on the in-car screen, tracking as the car moves. Special zones can be defined to trigger different behaviour, for example zooming in on an often-congested area before the car actually reaches said area; this allows for the driver to avoid having to adjust the system to check traffic several miles down the road.

### Architecture overview

The in-car components consist of a browser-based screen to show the maps themselves, GPSD to handle the actual GPS receiver interactions, and a Python server to take the resulting GPS data and format it to be sent to the server. The server receives the GPS data, decides where the screen should focus, and returns the correct center location and scale value.

The server exists to handle zone interaction and to avoid the need to have in-car persistence for zones and other data. To change the zones, or redirect the screen, or change the defaults, only server-side changes are needed.

As well as the software components in this project, an Internet connection will be needed from the car, and a know hostname will be needed for the server. The Internet connection can be anything, including a tethered mobile phone, while the server can be anywhere, including in a cloud.

#### Source (including tests)

The code is written in JavaScript (server and browser) and Python (GPSD interactions). Unit tests exist (see the various "test" directories) to validate behaviour.

#### Next steps

- Enable time-base behaviour: if the car picked someone up in the morning, that might affect the route home (appears to be a source of confusion for Google Now).
- Status messages: The server and car-side code should be able to display status messages on the screen.
- Create a more resilient infrastructure on the car side: at the moment, if the internet link dies, there's nothing to restart it.

