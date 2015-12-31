import unittest

import time
import threading
from queue import *
import sys
sys.path.append('..')
from gpsdproxy import *

class TestGPSDProxyMethods(unittest.TestCase):

  def test_baseClassGetFixThrows(self):
      gpsdproxy = GPSDProxy(None);
      with self.assertRaises(Exception):
          gpsdproxy.get_fix()

  def test_fakePopulatesQueue(self):
      gpsFixEventQueue = Queue(1);
      gpsdproxy = GPSDProxyFake(gpsFixEventQueue);
      gpsdproxy.setSleepTime(1);
      gpsdproxy.start() # start it up

      self.assertEqual(gpsFixEventQueue.get(True, 10).toSomething(),
                       (51.017409, -1.347936,"2015-12-28T17:01:32.993Z" , 0.0))
      gpsdproxy.stop()
      
if __name__ == '__main__':
    unittest.main()
