#!/usr/bin/python3

#
# This app does several things:
# - Gets location info from the GPS server.
# - Sends it to the server in the freezer room.
# - Receives back the location to put on the screen
#   in car.
# - Hands the location information to the web pages
#   when called from the browser.
#

from gps import *
from time import *
from bottle import hook, run, response, route
import time
import threading
from queue import *
import requests
import argparse
import sys

sys.path.append('../lib/python3')
from gpsdproxy import GPSDProxyFake, GPSDProxyReal

class CarDisplayLocation:
  def __init__(self):
    self.latitude  = 50.939428333
    self.longitude = -1.384196667
    self.scale = 13

carDisplayLocation = CarDisplayLocation()

# GPS interaction code
gpsdproxy = None

gpsFixEventQueue = Queue(10000);

# ************************************************************************
#
#
# Web API code (relies on gpsdproxy from above)
#
#
# ************************************************************************
@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'

# Need to implement averaged as well somehow, though it may not 
# be neccessary if the GPS unit does enough already.
@route('/gpsdata/immediate')
def get_immediate_data():
    current_fix = gpsdproxy.get_fix()
    print('latitude    ' ,current_fix.latitude)
    print('longitude   ' ,current_fix.longitude)
    print('time      + ',current_fix.time)
    return {'lat':current_fix.latitude, 'lon':current_fix.longitude, 'time':current_fix.time, 'speed': current_fix.speed}


@route('/car/display/location')
def get_screen_location():
    print('latitude    ' ,carDisplayLocation.latitude)
    print('longitude   ' ,carDisplayLocation.longitude)
    print('scale       ' ,carDisplayLocation.scale)
    return {'location':{'lat':carDisplayLocation.latitude, 'lon':carDisplayLocation.longitude}, 'scale':carDisplayLocation.scale}

# ************************************************************************
#
#
# Queue monitor with API calls out to central server
#
#
# ************************************************************************

gpsQueueMon = None

class GPSQueueMonitor(threading.Thread):
  def __init__(self):
    threading.Thread.__init__(self)
    self.running = True

  def run(self):
    global carDisplayLocation
    while True:
      next_fix = None
      try:  
        next_fix = gpsFixEventQueue.get(True, 10)
        print("Received fix: ")
        print('   latitude  ' ,next_fix.latitude)
        print('   longitude ' ,next_fix.longitude)
        resp = requests.post("http://192.168.1.70:13000/car/display/location", data = json.dumps({'lat':next_fix.latitude, 'lon':next_fix.longitude, 'time':next_fix.time, 'speed': next_fix.speed}), headers={'Content-Type': 'application/json'})
        print("resp")
        respJson = resp.json()
        print(respJson)
        
        new_loc = CarDisplayLocation()
        new_loc.latitude  = respJson['location']['lat']
        new_loc.longitude = respJson['location']['lon']
        new_loc.scale     = respJson['scale']
        carDisplayLocation = new_loc

      except:
        try:
          print("Exception - using current location", sys.exc_info()[0])
          new_loc = CarDisplayLocation()
          new_loc.latitude  = next_fix.latitude
          new_loc.longitude = next_fix.longitude
          carDisplayLocation = new_loc
          
        except:
          print("Unexpected error in dealing with previous error", sys.exc_info()[0])

        time.sleep(1) #set to whatever


# ************************************************************************
#
#
# Main code to start things off
#
#
# ************************************************************************

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--fake", help="Use fake GPS data instead of connecting to GPSD", action="store_true")
    args = parser.parse_args()

    gpsQueueMon = GPSQueueMonitor()
    gpsQueueMon.start()

    if args.fake:
      print("using fake GPS data")    
      gpsdproxy = GPSDProxyFake(gpsFixEventQueue) # Create the polling object to handle GPS data
    else:
      gpsdproxy = GPSDProxyReal(gpsFixEventQueue) # Create the polling object to handle GPS data

    gpsdproxy.start() # start it up
    
    #run(host='localhost', port=13010)
    run(host='0.0.0.0', port=13010)
