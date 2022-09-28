import time
import argparse
# from tkinter import W
from backend import Wish
from backend.Wishlist import Wishlist
from backend.User import User
from backend.external import *
import logging
import json
from bson import json_util
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.objectid import ObjectId
from flask import Flask, jsonify, Response, render_template, make_response, request, send_file, redirect, url_for, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
import flask_praetorian
from dotenv import load_dotenv
from mongoengine import connect
from logging.config import dictConfig
import os
import sys
import csv
# import pathlib
from backend.Utils import *
from datetime import datetime

print("running app.py name is + ", __name__)
guard = flask_praetorian.Praetorian()

load_dotenv()
isheroku = os.environ.get('ISHEROKU')
port = int(os.environ.get('PORT'))
print("$$$$$$$$$$$$$$$$port ")
print(port)
if isheroku:
    print("isheroku")
    currdir = os.path.dirname(os.path.dirname(__file__))
    print(currdir)
    template_dir = os.path.abspath("./build/")
    # template_dir = os.path.abspath("../../frontend/build/")
    # template_dir = os.path.dirname(
    #     os.path.abspath(os.path.dirname(__file__) + "/../"))
    print("template_dir")
    print(template_dir)
    backenddir = os.path.join(currdir, 'backend')
    # template_dir = os.path.join(template_dir, 'frontend')
    LOGGING_CONFIG = {
        'version': 1,
        'loggers': {
            '': {  # root logger
                'level': 'INFO',
                'handlers': ['debug_console_handler'],
            }
            # ,
            # 'my.package': {
            #     'level': 'WARNING',
            #     'propagate': False,
            #     'handlers': ['info_rotating_file_handler', 'error_file_handler'],
            # },
        },
        'handlers': {
            'debug_console_handler': {
                'level': 'DEBUG',
                'formatter': 'info',
                'class': 'logging.StreamHandler',
                'stream': 'ext://sys.stdout',
            }
        },
        'formatters': {
            'info': {
                'format': '%(asctime)s-%(levelname)s-%(name)s-%(process)d::%(module)s|%(lineno)s:: %(message)s'
            },
        },

    }
    dictConfig(LOGGING_CONFIG)


else:
    maindir = os.path.dirname(os.path.abspath(__file__))
    # print("maindir")
    # print(maindir)
    backenddir = os.path.join(maindir, 'backend')
    # template_dir = os.path.join(template_dir, 'frontend')
    template_dir = os.path.join(maindir, 'build')

    LOGGING_CONFIG = {
        'version': 1,
        'loggers': {
            '': {  # root logger
                'level': 'INFO',
                'handlers': ['debug_console_handler', 'rotating_file_handler', 'error_file_handler'],
            }
            # ,
            # 'my.package': {
            #     'level': 'WARNING',
            #     'propagate': False,
            #     'handlers': ['info_rotating_file_handler', 'error_file_handler'],
            # },
        },
        'handlers': {
            'debug_console_handler': {
                'level': 'DEBUG',
                'formatter': 'info',
                'class': 'logging.StreamHandler',
                'stream': 'ext://sys.stdout',
            },
            'rotating_file_handler': {
                'level': 'INFO',
                'formatter': 'info',
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': 'app.log',
                'mode': 'a',
                'maxBytes': 1048576,
                'backupCount': 2
            },
            'error_file_handler': {
                'level': 'WARNING',
                'formatter': 'error',
                'class': 'logging.FileHandler',
                'filename': 'error.log',
                'mode': 'a',
            }
        },
        'formatters': {
            'info': {
                'format': '%(asctime)s-%(levelname)s-%(name)s::%(module)s|%(lineno)s:: %(message)s'
            },
            'error': {
                'format': '%(asctime)s-%(levelname)s-%(name)s-%(process)d::%(module)s|%(lineno)s:: %(message)s'
            },
        },

    }

    dictConfig(LOGGING_CONFIG)
    # logging.basicConfig(filename="app.log",
    #                     format='%(asctime)s %(message)s',
    #                     filemode='w')
# logger.info(os.listdir(template_dir+"/"))

# template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

IS_DEV = os.environ.get('FLASK_ENV') == "development"


flaskapp = Flask("app", root_path="wishlist",
                 template_folder=template_dir, static_folder=template_dir, static_url_path='/')
flaskapp.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

cors = CORS(flaskapp)  # comment this on deployment
api = Api(flaskapp)

flaskapp.config["SECRET_KEY"] = "top secret"
flaskapp.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
flaskapp.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
flaskapp.config["PRAETORIAN_ROLES_DISABLED"] = True

guard.init_app(flaskapp, User)


# if app.use_reloader:
#     logger.info("run german thing")
# The app is not in debug mode or we are in the reloaded process


logger = logging.getLogger()

# logger.setLevel(logging.INFO)
# app.config.from_object('config')


connstring = os.environ.get('MONGODB_URI')
logger.info("connstring is %s", connstring)
try:
    if connstring is None:
        connect(db="wish")
        client = MongoClient('localhost', 27017)
        logger.info('Connected to local MongoDB')
    else:
        connect(host=connstring)
        client = MongoClient(connstring)
        logger.info('Connected to Atlas MongoDB')
# logger.info(client.server_info())
except Exception as e:
    logger.error("Unable to connect to the server.", e)

try:
    client.admin.command('ping')
    logger.info('Data Base Connection Established........')

except ConnectionFailure as err:
    logger.error("Data Base Connection failed. Error: {err}")

# if IS_DEV:
#     proxy(WEBPACK_DEV_SERVER_HOST, request.path)
# User(username="test", password=guard.hash_password('test'), lastName="testlast",
#      firstName="testfirst", email="test@test1.com", id="test").save()


@flaskapp.route('/favicon.ico')
def favicon():
    # statpath = app.static_folder
    # return render_template('index.html')
    return send_from_directory(backenddir, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@flaskapp.route('/', defaults={'path': ''})
@flaskapp.route('/app/', defaults={'path': ''})
@flaskapp.route('/<path:path>')
# @flaskapp.errorhandler(404)
def serve(path):
    statpath = flaskapp.static_folder
    # logger.info("flaskapp.template_folder")
    # logger.info(flaskapp.template_folder)
    # logger.info("flaskapp.template_folder files are")
    # logger.info(os.listdir(flaskapp.template_folder))
    print("running slash path")
    print(render_template('index.html'))

    return render_template('index.html')


@flaskapp.errorhandler(404)
def showErrorPage(self):
    # print(flaskapp.template_folder)
    return make_response(render_template('error.html'), 404)


@flaskapp.route('/login', methods=['POST'])
def login():
    print("login request")

    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"username":"Yasoob","password":"strongpassword"}'
    """
    req = request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'user': {'access_token': guard.encode_jwt_token(
        user), 'username': username}}
    return jsonify(ret), 200


@flaskapp.route('/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200


@flaskapp.route('/protected')
@flask_praetorian.auth_required
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return {'message': f'protected endpoint (allowed user {flask_praetorian.current_user().username})'}


@ flaskapp.route("/submitwish", methods=["POST"], strict_slashes=False)
def addWish():
    wishlistlink = ""
    availability = ""
    id = ""

    reqdict = request.get_json()
    logger.info("reqdict is ", reqdict)
    itemname = request.json['name']
    quantity = request.json['quantity']
    cost = request.json['cost']
    link = request.json['link']
    category = request.json['category']
    description = request.json['description']
    wishlist = request.json['wishlist']
    source = request.json['source']
    owner = request.json['owner']
    if 'wishlistlink' in reqdict:
        wishlistlink = request.json['wishlistlink']
    if 'availability' in reqdict:
        availability = request.json['availability']
    if '_id' in reqdict:
        id = request.json['_id']
    modified_date = datetime.today()
    # objid = ObjectId(id)
    if id is None or id == "":
        id = wishlist + "_" + itemname.replace(" ", "_").lower()
    logger.info("id is ", id)
    wishToSave = Wish(name=itemname, description=description, cost=cost, quantity=quantity, category=category, link=link,
                      wishlist=wishlist, wishlistLink=wishlistlink, id=id, availability=availability, source=source, modified_date=modified_date, owner=owner)

    # mydatabase = client.wish
    # mycollection = mydatabase.wishes

    # record = {
    #     'description': description,
    #     'name': itemname,
    #     'cost': cost,
    #     'link': link,
    #     'quantity': quantity,
    #     'category': category,
    #     'wishlist': wishlist,
    #     'modified_date': modified_date,
    #     'source': source
    # }
    try:
        wishToSave.save()
    except Exception as e:
        logger.error("Error saving wish %s", e)
        return jsonify({"status": "error", "message": "Error saving wish"})
    # rec = mycollection.replace_one({"_id": objid}, record, upsert=True)

    return jsonify("Successfully added wish")


@ flaskapp.route("/DeleteWish", methods=["POST"], strict_slashes=False)
@ cross_origin()
def DeleteWish():

    id = request.get_json()

    try:
        remobj = Wish.objects.get(id=id)
        remobj.delete()
    except Exception as e:
        logger.error("Error removing wish %s", e)
        return jsonify({"status": "error", "message": "Error removing wish"})

    return jsonify("Successfully removed wish")


@ flaskapp.route("/GetWishes", methods=["GET"], strict_slashes=False)
@ cross_origin()
def getWishes():
    logger.info("running flask route getwishes")
    # client = MongoClient('localhost', 27017)
    # mydatabase = client.wish
    # mycollection = mydatabase.wishes
    try:
        wishes = Wish.objects.to_json()
    #     # getReiWishes()
    #     logger.info("run REI")
    # except Exception as e:
    #     logger.info("Error getting rei wishlist %s", e)
    # try:
    #     logger.info("run amazon")
    #     # getAmazonWishes()
    except Exception as e:
        logger.info("Error GetWishes %s", e)

    # wishes = mycollection.find({})
    # logger.info(json_util.dumps(wishes))
    return wishes
    # return json_util.dumps(wishes)


@ flaskapp.route("/GetWishlists", methods=["GET"], strict_slashes=False)
@ cross_origin()
def getWishlists():
    logger.info("running flask route getwishlists")

    # client = MongoClient('localhost', 27017)
    # mydatabase = client.wish
    # mycollection = mydatabase.wishes
    try:
        # lists = mycollection.distinct("wishlist")
        # lists = Wish.objects.distinct("wishlist")
        lists = Wishlist.objects.to_json()

    except Exception as e:
        logger.info("Error getting distinct wishlists %s", e)

    # wishes = mycollection.find({})
    # logger.info(json_util.dumps(wishes))
    return lists


@ flaskapp.route("/AddWishlist", methods=["POST"], strict_slashes=False)
@ cross_origin()
def insertWishlist():
    id = ""

    reqdict = request.get_json()
    logger.info("reqdict is ", reqdict)
    name = request.json['name']
    owner = request.json['owner']

    if 'link' in reqdict:
        link = request.json['link']
    if '_id' in reqdict:
        id = request.json['_id']
    added_date = datetime.today()

    if id is None or id == "":
        id = link.lower()

    if ".com" in link:
        baseLink = link[:link.rfind(".com") + 4]
    else:
        baseLink = link

    wishlistToSave = Wishlist(name=name, baseLink=baseLink,
                              link=link, id=id, added_date=added_date, owner=owner)

    try:
        wishlistToSave.save()
    except Exception as e:
        logger.error("Error saving wishlist %s", e)
        return jsonify({"status": "error", "message": "Error saving wishlist"})

    return jsonify("Successfully added wishlist")


@ flaskapp.route("/DeleteWishlist", methods=["POST"], strict_slashes=False)
@ cross_origin()
def DeleteWishlist():

    id = request.get_json()

    try:
        remobj = Wishlist.objects.get(id=id)
        remobj.delete()
    except Exception as e:
        logger.error("Error removing wishlist %s", e)
        return jsonify({"status": "error", "message": "Error removing wishlist"})

    return jsonify("Successfully removed wishlist")


@ flaskapp.route("/FetchExternalWishes", methods=["GET"], strict_slashes=False)
@ cross_origin()
def fetchExternalWishes():
    logger.info("running flask route FetchExternalWishes")
    try:
        getAllExternal()
    except Exception as e:
        logger.info("Error getting external wishes %s", e)

    wishes = Wish.objects.to_json()
    return wishes


@ flaskapp.route('/go_outside_flask/<path:link>', strict_slashes=False)
def go_outside_flask_method(link):

    return link
