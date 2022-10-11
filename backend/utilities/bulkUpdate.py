import sys
import os
from pymongo.errors import ConnectionFailure
from pymongo import MongoClient
from mongoengine import connect
from dotenv import load_dotenv
from mongoengine.queryset.visitor import Q
import json
directory = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
sys.path.append(directory)

from backend.wishlist import Wishlist
from backend.wish import Wish


load_dotenv()
connstring = os.environ.get('MONGODB_URI')
print("connstring is %s", connstring)
try:
    if connstring is None:
        connect(db="wish")
        client = MongoClient('localhost', 27017)
        print('Connected to local MongoDB')
    else:
        connect(host=connstring)
        client = MongoClient(connstring)
        print('Connected to Atlas MongoDB')
# logger.info(client.server_info())
except Exception as e:
    print("Unable to connect to the server.", e)

try:
    client.admin.command('ping')
    print('Data Base Connection Established........')

except ConnectionFailure as err:
    print("Data Base Connection failed. Error: {err}")

Wishlist.objects.update(set__owner="dnraitzyktest")
Wish.objects.update(set__owner="dnraitzyktest")
