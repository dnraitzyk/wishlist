import time
import argparse
# from tkinter import W
from backend import Wish
from backend.external import *
import logging
import json
from bson import json_util
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.objectid import ObjectId
from flask import Flask, jsonify, render_template, request, redirect, url_for, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from mongoengine import connect
import os
import sys
# import pathlib
from backend.wishlist import *
from datetime import datetime
print("running app.py name is + ", __name__)

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

else:
    template_dir = os.path.dirname(os.path.abspath(__file__))
    print("template_dir")
    print(template_dir)
    backenddir = os.path.join(template_dir, 'backend')
    # template_dir = os.path.join(template_dir, 'frontend')
    template_dir = os.path.join(template_dir, 'build')

print(os.listdir(template_dir+"/"))

# template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

flaskapp = Flask("app", root_path="wishlist",
                 template_folder=template_dir, static_folder=template_dir, static_url_path='/')
flaskapp.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

cors = CORS(flaskapp)  # comment this on deployment
api = Api(flaskapp)


# if app.use_reloader:
#     print("run german thing")
# The app is not in debug mode or we are in the reloaded process


logging.basicConfig(filename="app.log",
                    format='%(asctime)s %(message)s',
                    filemode='w')

logger = logging.getLogger()
# flaskapp.logger.addHandler(logging.StreamHandler(sys.stdout))

logger.setLevel(logging.INFO)
# app.config.from_object('config')

IS_DEV = os.environ.get('FLASK_ENV') == "development"

connstring = os.environ.get('MONGODB_URI')
print("connstring is ", connstring)
try:
    if connstring is None:
        connect(db="wish")
        client = MongoClient('localhost', 27017)
    else:
        connect(host=connstring)
        client = MongoClient(connstring)
# print(client.server_info())
except Exception as e:
    print("Unable to connect to the server.", e)
    logger.error("Unable to connect to the server.", e)

try:
    client.admin.command('ping')
    print('Data Base Connection Established........')

except ConnectionFailure as err:
    print("Data Base Connection failed. Error: {err}")

# if IS_DEV:
#     proxy(WEBPACK_DEV_SERVER_HOST, request.path)


@flaskapp.route('/favicon.ico')
def favicon():
    # statpath = app.static_folder

    # return render_template('index.html')
    return send_from_directory(backenddir, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@flaskapp.route('/', defaults={'path': ''})
@flaskapp.route('/<path:path>')
@flaskapp.errorhandler(404)
def serve(path):
    statpath = flaskapp.static_folder
    print("flaskapp.template_folder")
    print(flaskapp.template_folder)
    print("flaskapp.template_folder files are")
    print(os.listdir(flaskapp.template_folder))
    # print(statpath)

    return render_template('index.html')


@flaskapp.route("/submitwish", methods=["POST"], strict_slashes=False)
def addWish():
    wishlistlink = ""
    availability = ""
    id = ""

    reqdict = request.get_json()
    print("reqdict is ", reqdict)
    itemname = request.json['name']
    quantity = request.json['quantity']
    cost = request.json['cost']
    link = request.json['link']
    category = request.json['category']
    description = request.json['description']
    wishlist = request.json['wishlist']
    source = request.json['source']
    if 'wishlistlink' in reqdict:
        wishlistlink = request.json['wishlistlink']
    if 'availability' in reqdict:
        availability = request.json['availability']
    if '_id' in reqdict:
        id = request.json['_id']
    modified_date = datetime.today()
    # objid = ObjectId(id)
    if id is None or id == "":
        id = wishlist+"_" + itemname.replace(" ", "_").lower()
    print("id is ", id)
    wishToSave = Wish(name=itemname, description=description, cost=cost, quantity=quantity, category=category, link=link,
                      wishlist=wishlist, wishlistLink=wishlistlink, id=id, availability=availability, source=source, modified_date=modified_date)

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
        print("Error saving wish %s", e)
        logger.error("Error saving wish %s", e)
        return jsonify({"status": "error", "message": "Error saving wish"})
    # rec = mycollection.replace_one({"_id": objid}, record, upsert=True)

    return jsonify("Successfully added wish")


@ flaskapp.route("/GetWishes", methods=["GET"], strict_slashes=False)
@ cross_origin()
def getWishes():
    print("running flask route getwishes")
    # client = MongoClient('localhost', 27017)
    # mydatabase = client.wish
    # mycollection = mydatabase.wishes
    # try:
    #     # getReiWishes()
    #     print("run REI")
    # except Exception as e:
    #     logger.info("Error getting rei wishlist %s", e)
    # try:
    #     print("run amazon")
    #     # getAmazonWishes()
    # except Exception as e:
    #     logger.info("Error getting amazon wishlist %s", e)

    # wishes = mycollection.find({})
    wishes = Wish.objects.to_json()
    # logger.info(json_util.dumps(wishes))
    return wishes
    # return json_util.dumps(wishes)


@ flaskapp.route("/GetWishlists", methods=["GET"], strict_slashes=False)
@ cross_origin()
def getWishlists():
    # client = MongoClient('localhost', 27017)
    # mydatabase = client.wish
    # mycollection = mydatabase.wishes
    try:
        # lists = mycollection.distinct("wishlist")
        lists = Wish.objects.distinct("wishlist")

    except Exception as e:
        logger.info("Error getting distinct wishlists %s", e)

    # wishes = mycollection.find({})
    # logger.info(json_util.dumps(wishes))
    return json_util.dumps(lists)


@ flaskapp.route("/FetchExternalWishes", methods=["GET"], strict_slashes=False)
@ cross_origin()
def fetchExternalWishes():
    print("running flask route FetchExternalWishes")
    try:
        getAllExternal()
    except Exception as e:
        logger.info("Error getting external wishes %s", e)

    wishes = Wish.objects.to_json()
    return wishes


@ flaskapp.route('/go_outside_flask/<path:link>', strict_slashes=False)
def go_outside_flask_method(link):

    return link
