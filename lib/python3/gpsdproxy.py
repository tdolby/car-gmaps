#!/usr/bin/python3

#
# This library wraps the GPSD API and presents a queue-
# based view of the GPS information.
# The application using this interface doesn't need to
# worry about the GPSD server connection closing if it
# can't pick up the data quickly enough, and could (if
# it chose) pass a depth-1 queue into the constructor.
#

from gps import *
from time import *
import time
import threading
from queue import *

class GPSDProxy():
  def __init__(self, _gpsFixEventQueue):
    self.gpsFixEventQueue = _gpsFixEventQueue;
    self.running = False

  def get_fix(self):
    raise Exception("Can't invoke base-class get_fix() method")

  def stop(self):
    self.running = False

class GPSDProxyReal(GPSDProxy, threading.Thread):
  def __init__(self, _gpsFixEventQueue):
    threading.Thread.__init__(self)
    verbose = False
    opts = {"verbose": verbose}
    self.gpsFixEventQueue = _gpsFixEventQueue;
    self.gpsd_link = GPS(**opts)
    self.gpsd_link.stream(WATCH_ENABLE) #starting the stream of info
    self.running = True

  def get_fix(self):
    return self.gpsd_link.fix

  def run(self):
    while self.running:
      try:  
        GPSCommon.waiting(self.gpsd_link, 10)
        self.gpsd_link.next() #this will continue to loop and grab EACH set of gpsd info to clear the buffer
        self.gpsFixEventQueue.put_nowait(self.gpsd_link.fix);
      except:
        # print("Unexpected error:", sys.exc_info()[0])
        time.sleep(1) #set to whatever
  
class GPSFixFake:
  def __init__(self):
    # Start north of Otterbourne
    self.latitude  = 51.020409
    self.longitude = -1.347936
    self.time = "2015-12-28T17:01:32.993Z"
    self.speed = 0.0
  def toSomething(self):
    return (self.latitude, self.longitude,  self.time,  self.speed)

class GPSDProxyFake(GPSDProxy, threading.Thread):
  def __init__(self, _gpsFixEventQueue):
    threading.Thread.__init__(self)
    self.gpsFixEventQueue = _gpsFixEventQueue;
    self.running = True
    self.current_fix = GPSFixFake()
    self.sleepTime = 5

  def get_fix(self):
    self.current_fix.latitude -= 0.003
    return self.current_fix
  
  def setSleepTime(self, time):
    self.sleepTime = time
  
  def run(self):
    while self.running:
      try:
        self.get_fix()
        self.gpsFixEventQueue.put_nowait(self.current_fix);
        time.sleep(sleepTime)
      except:
        #print("Unexpected error:", sys.exc_info()[0])
        time.sleep(1) #set to whatever

#

