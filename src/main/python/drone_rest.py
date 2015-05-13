import os, os.path
import simplejson
import time

from pymavlink import mavutil
import droneapi.lib
from droneapi.lib import VehicleMode, Location, Command

import cherrypy
from cherrypy.process import wspbus, plugins
from jinja2 import Environment, FileSystemLoader

def cors():
  if cherrypy.request.method == 'OPTIONS':
    cherrypy.response.headers['Access-Control-Allow-Methods'] = 'POST'
    cherrypy.response.headers['Access-Control-Allow-Headers'] = 'content-type'
    cherrypy.response.headers['Access-Control-Allow-Origin']  = '*'
    return True
  else:
    cherrypy.response.headers['Access-Control-Allow-Origin'] = '*'

cherrypy.tools.cors = cherrypy._cptools.HandlerTool(cors)

cherrypy_conf = {
    '/': {
        'tools.sessions.on': True,
        'tools.staticdir.root': local_path,
    },
    '/static': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': './html/assets'
    }
}

#
##
###
class Drone(object):
    def __init__(self, home_coords, server_enabled=True):
        self.api = local_connect()
        self.gps_lock = False
        self.altitude = 30.0
        self.vehicle = self.api.get_vehicles()[0]
        self.commands = self.vehicle.commands
        self.current_coords = []
        self.home_coords = home_coords
        self.webserver_enabled = server_enabled
        self._log("DroneDelivery Start")

        # Register observers 
        self.vehicle.add_attribute_observer('armed', self.armed_callback)
        self.vehicle.add_attribute_observer('location', self.location_callback)
        self.vehicle.add_attribute_observer('velocity', self.velocity_callback)
        self.vehicle.add_attribute_observer('groundspeed', self.groundspeed_callback)
        #self.vehicle.add_attribute_observer('mode', self.mode_callback)
        self.vehicle.add_attribute_observer('gps_0', self.gps_callback)

        self._log("Waiting for GPS Lock")

    def takeoff(self):
        self._log("Taking off")
        self.commands.takeoff(30.0)
        self.vehicle.flush()

    def arm(self, toggle=True):
        if toggle:
            self._log("Arming")
        else:
            self._log("Disarming")
        self.vehicle.armed = True
        self.vehicle.flush()

    def run(self):
        self._log('Running initial boot sequence')
        self.arm()
        self.takeoff()
        self.change_mode('GUIDED')

        if self.webserver_enabled is True:
            self._run_server()

    def _run_server(self):
        # Start web server if enabled
        cherrypy.tree.mount(DroneDelivery(self), '/', config=cherrypy_conf)

        cherrypy.config.update({
            'server.socket_port': 8080,
            'server.socket_host': '0.0.0.0',
            'log.screen': None
         })

        cherrypy.engine.start()

    def change_mode(self, mode):
        self._log("Mode: {0}".format(mode))
        self.vehicle.mode = VehicleMode(mode)
        self.vehicle.flush()

    def gotomission(self, path):
       
        self.change_mode('HOLD')
        self.vehicle.commands.clear();
        self.vehicle.flush()
        time.sleep(2)

        num = 1
        self.vehicle.commands.add(Command(1,0,0,3,16,1,1,0,5,0,0,path[0]['lat'], path[0]['lng'],20))
      
        for pathitem in path:
	    self.vehicle.commands.add(Command(1,0,num,3,16,0,1,0,5,0,0,pathitem['lat'], pathitem['lng'],20))
            num+=1

        self.vehicle.flush()
        time.sleep(4)
        self.change_mode('AUTO')
        self.vehicle.flush()
        self.vehicle.commands.next =0
        self.vehicle.flush()

    def clearmission(self):
        self.change_mode('RTL')
        time.sleep(2)
        self.vehicle.commands.clear()
        self.vehicle.flush()
        time.sleep(2)
        self.vehicle.commands.next = 0
        self.vehicle.flush()

    def get_mission(self):
        points = []
        for command in self.vehicle.commands:
            points.append(dict(lat=command.x, lon=command.y))
        return points

    def get_groundspeed(self):
        return self.current_groundspeed

    def groundspeed_callback(self, groundspeed):
        groundspeed = self.vehicle.groundspeed
        self.current_groundspeed = groundspeed

    def get_velocity(self):
        return self.current_velocity

    def velocity_callback(self, velocity):
        velocity = self.vehicle.velocity
        self.current_velocity = velocity
    
    def get_mode(self):
         return self.vehicle.mode

    def get_commands(self):
         return self.commands

    def get_next(self):
         if(self.vehicle.commands.count>0):
             pos = self.vehicle.commands[self.vehicle.commands.next]
             return dict(lat=pos.x, lon=pos.y) 
         else:
             return dict(lat=self.current_location.lat, lon=self.current_location.lon)

    def get_altitude(self):
         return self.altitude

    def get_location(self):
        return [self.current_location.lat, self.current_location.lon]

    def location_callback(self, location):
        location = self.vehicle.location

        if location.alt is not None:
            self.altitude = location.alt

        self.current_location = location

    def armed_callback(self, armed):
        self._log("DroneDelivery Armed Callback")
        self.vehicle.remove_attribute_observer('armed', self.armed_callback)

    def mode_callback(self, mode):
        self._log("Mode: {0}".format(self.vehicle.mode))

    def gps_callback(self, gps):
        self._log("GPS: {0}".format(self.vehicle.gps_0))
        if self.gps_lock is False:
            self.gps_lock = True
            self.vehicle.remove_attribute_observer('gps_0', self.gps_callback)
            self.run()

    def _log(self, message):
        print "[DEBUG]: {0}".format(message)

class Templates:
    def __init__(self, home_coords):
        self.home_coords = home_coords
        self.options = self.get_options()
        self.environment = Environment(loader=FileSystemLoader( local_path + '/html'))

    def get_options(self):
        return {
                'width': 670,
                'height': 470,
                'zoom': 13,
                'format': 'png',
                'access_token': 'pk.eyJ1IjoibXJwb2xsbyIsImEiOiJtUG0tRk9BIn0.AqAiefUV9fFYRo-w0jFR1Q',
                'mapid': 'mrpollo.kfbnjbl0',
                'home_coords': self.home_coords,
                'menu': [
                    {'name': 'Home', 'location': '/'},
                    {'name': 'Track', 'location': '/track'},
                    {'name': 'Command', 'location': '/command'}
                    ],
                'current_url': '/',
                'json': ''
                }

    def index(self):
        self.options = self.get_options()
        self.options['current_url'] = '/'
        return self.get_template('index')

    def track(self, current_coords):
        self.options = self.get_options()
        self.options['current_url'] = '/track'
        self.options['current_coords'] = current_coords
        self.options['json'] = simplejson.dumps(self.options)
        return self.get_template('track')

    def command(self, current_coords):
        self.options = self.get_options()
        self.options['current_url'] = '/command'
        self.options['current_coords'] = current_coords
        return self.get_template('command')

    def get_template(self, file_name):
        template = self.environment.get_template( file_name + '.html')
        return template.render(options=self.options)

#
##
###
class DroneDelivery(object):
    def __init__(self, drone):
        self.drone = drone
        self.templates = Templates(self.drone.home_coords)

    @cherrypy.expose
    def index(self):
        return self.templates.index()

    @cherrypy.expose
    def command(self):
        return self.templates.command(self.drone.get_location())

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def velocity(self):
	return self.drone.get_velocity()

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def groundspeed(self):
	return self.drone.get_groundspeed()
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def location(self):
        return  dict(lat=self.drone.get_location()[0], lon=self.drone.get_location()[1])

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def vehicle(self):
        return dict(position=self.drone.get_location())

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def altitude(self):
         return self.drone.get_altitude()
 
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def commands(self):
         return self.drone.get_commands().count

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def next(self):
         return self.drone.get_next()

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def mode(self):
         return self.drone.get_mode().name

    @cherrypy.expose
    def track(self, lat=None, lon=None):
        if(lat is not None and lon is not None):
            self.drone.goto([lat, lon], True)
        return self.templates.track(self.drone.get_location())

    @cherrypy.expose
    def clearmission(self):
	self.drone.clearmission()
        return "clear" 
  
    @cherrypy.expose
    def hold(self):
        self.drone.change_mode("HOLD")
        return "HOLD" 

    @cherrypy.expose
    def auto(self):
        self.drone.change_mode("AUTO")
        return "AUTO" 

    @cherrypy.expose
    @cherrypy.config(**{'tools.cors.on': True})
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def gotomission(self):
        data = cherrypy.request.json
        self.drone.gotomission(data)
        return data[0]
     
    @cherrypy.expose
    @cherrypy.config(**{'tools.cors.on': True})
    @cherrypy.tools.json_out()
    def get_mission(self):
         return self.drone.get_mission()

Drone([32.5738, -117.0068])
cherrypy.engine.block()
