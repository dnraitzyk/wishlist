from .external import *
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from mongoengine import connect
import os
import sys

logging.basicConfig(stream=sys.stdout)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

connstring = os.environ.get('MONGODB_URI')
try:
    if connstring is None:
        connect(db="wish")
        client = MongoClient('localhost', 27017)
    else:
        connect(host=connstring)
        client = MongoClient(connstring)
# print(client.server_info())
except Exception as e:
    print("Unable to connect to the server from job.", e)
    logger.error("Unable to connect to the server from job.", e)

try:
    client.admin.command('ping')
    print('Data Base Connection Established during job........')

except ConnectionFailure as err:
    print("Data Base Connection failed from job. Error: {err}")

try:
    getAllExternal()
except Exception as e:
    logger.info("Error getting external wishes during job %s", e)
    print("Error getting external wishes during job %s", e)
