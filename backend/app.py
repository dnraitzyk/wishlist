import time
import argparse
# from tkinter import W
from Wish import *
import logging
import json
from bson import json_util
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask, jsonify, render_template, request, redirect, url_for, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
# import pathlib
from wishlist import *
from datetime import datetime
print("running app.py name is + ", __name__)


load_dotenv()
isheroku = os.environ.get('ISHEROKU')

if isheroku:
    print("isheroku")
    currdir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
    print(currdir)
    template_dir = "../frontend"
    # template_dir = os.path.dirname(
    #     os.path.abspath(os.path.dirname(__file__) + "/../"))
    print(template_dir)
    backenddir = os.path.join(currdir, 'backend')
    # template_dir = os.path.join(template_dir, 'frontend')

else:
    template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
    backenddir = os.path.join(template_dir, 'backend')
    template_dir = os.path.join(template_dir, 'frontend')
    template_dir = os.path.join(template_dir, 'build')


# template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

flaskapp = Flask("app", root_path="wishlist",
                 template_folder=template_dir, static_folder=template_dir, static_url_path='/')

CORS(flaskapp)  # comment this on deployment
api = Api(flaskapp)


# if app.use_reloader:
#     print("run german thing")
# The app is not in debug mode or we are in the reloaded process


logging.basicConfig(filename="app.log",
                    format='%(asctime)s %(message)s',
                    filemode='w')

# logger = logging.getLogger()
flaskapp.logger.addHandler(logging.StreamHandler(sys.stdout))

logger.setLevel(logging.INFO)
# app.config.from_object('config')
logger.info("template dir is ")
logger.info(template_dir)


connstring = os.environ.get('MONGODB_URI')
print("connstring is ", connstring)
try:
    if connstring is None:
        client = MongoClient('localhost', 27017)
    else:
        client = MongoClient(connstring)

    # print(client.server_info())
except Exception as e:
    print("Unable to connect to the server.", e)
    logger.error("Unable to connect to the server.", e)


@ flaskapp.route('/favicon.ico')
def favicon():
    # statpath = app.static_folder

    # return render_template('index.html')
    return send_from_directory(backenddir, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@ flaskapp.route('/', defaults={'path': ''})
@ flaskapp.route('/<path:path>')
@ flaskapp.errorhandler(404)
def serve(path):
    statpath = flaskapp.static_folder

    # print(statpath)

    return render_template('index.html')


@ flaskapp.route("/submitwish", methods=["POST"], strict_slashes=False)
def addWish():
    reqdict = request.get_json()
    itemname = request.json['name']
    quantity = request.json['quantity']
    cost = request.json['cost']
    link = request.json['link']
    category = request.json['category']
    description = request.json['description']
    wishlist = request.json['wishlist']
    source = request.json['source']
    _id = reqdict.get("_id")
    modified_date = datetime.today()
    objid = ObjectId(_id)

    mydatabase = client.wish
    mycollection = mydatabase.wishes

    record = {
        'description': description,
        'name': itemname,
        'cost': cost,
        'link': link,
        'quantity': quantity,
        'category': category,
        'wishlist': wishlist,
        'modified_date': modified_date,
        'source': source
    }

    rec = mycollection.replace_one({"_id": objid}, record, upsert=True)

    return jsonify("Successfully added wish")


@ flaskapp.route("/GetWishes", methods=["GET"], strict_slashes=False)
def getWishes():

    # client = MongoClient('localhost', 27017)
    mydatabase = client.wish
    mycollection = mydatabase.wishes
    try:
        getReiWishes()
    except Exception as e:
        logger.info("Error getting rei wishlist %s", e)
    try:
        getAmazonWishes()
    except Exception as e:
        logger.info("Error getting amazon wishlist %s", e)

    wishes = mycollection.find({})
    # logger.info(json_util.dumps(wishes))
    return json_util.dumps(wishes)


@ flaskapp.route("/GetWishlists", methods=["GET"], strict_slashes=False)
def getWishlists():

    # client = MongoClient('localhost', 27017)
    mydatabase = client.wish
    mycollection = mydatabase.wishes
    try:
        lists = mycollection.distinct("wishlist")
    except Exception as e:
        logger.info("Error getting distinct wishlists %s", e)

    # wishes = mycollection.find({})
    # logger.info(json_util.dumps(wishes))
    return json_util.dumps(lists)


@ flaskapp.route('/go_outside_flask/<path:link>', strict_slashes=False)
def go_outside_flask_method(link):

    return link
