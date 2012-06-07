import pickle, random, datetime
import email.utils

# Include the Dropbox SDK libraries
from dropbox import client, rest, session

from twisted.application import service
from twisted.python import log
from twisted.web.resource import Resource
from twisted.web.server import Site
from twisted.application.internet import TCPServer
from twisted.web.static import File

# Get your app key and secret from the Dropbox developer website
APP_KEY = '7xz9tlpqte07832'
APP_SECRET = 'gwz3nnoj0kr5ole'

# ACCESS_TYPE should be 'dropbox' or 'app_folder' as configured for your app
ACCESS_TYPE = 'app_folder'

sess = session.DropboxSession(APP_KEY, APP_SECRET, ACCESS_TYPE)

try:
	tokenfile = open('token', 'r')
except:
	request_token = sess.obtain_request_token()

	url = sess.build_authorize_url(request_token)

	# Make the user sign in and authorize this token
	print "url:", url
	print "Please visit this website and press the 'Allow' button, then hit 'Enter' here."
	print "token:", request_token
	raw_input()
	tokenfile = open('token', 'w')
	access_token = sess.obtain_access_token(request_token)
	pickle.dump(access_token, tokenfile)
else:
	access_token = pickle.load(tokenfile)
	tokenfile.close()
	sess.set_token(access_token.key, access_token.secret)

client = client.DropboxClient(sess)
class Cache(object):
	def __init__(self):
		self.metadata = client.metadata('/')
		self.refreshed = datetime.datetime.now()
		self.refreshrate = datetime.timedelta(minutes=10)
		self.sharehistory = {}

	def getMetadata(self):
		if datetime.datetime.now() - self.refreshed > self.refreshrate:
			self.metadata = client.metadata('/')
			self.refreshed = datetime.datetime.now()
		return self.metadata

	def getUrl(self, path):
		if path in self.sharehistory and self.sharehistory[path]['expires'] < datetime.datetime.now():
			return self.sharehistory[path]['url']
		else:
			val = client.media(path)
			val['expires'] = datetime.datetime.now() + datetime.timedelta(hours=6)
			self.sharehistory[path] = val
			return val['url']

cache = Cache()

class Img(Resource):
	def render(self, request):
		metadata = cache.getMetadata()
		if 'contents' in metadata:
			image = random.choice(metadata['contents'])
			return cache.getUrl(image['path'])

root = Resource()
root.putChild("", File('./index.html'))
root.putChild("img", Img())

application = service.Application("cats")
tcpserver = TCPServer(2346, Site(root))
tcpserver.setServiceParent(application)
