import time
import argparse
from tkinter import W
from backend.Wish import Wish
import logging
import json
from bson import json_util
from pymongo import MongoClient
from bson.objectid import ObjectId
from backend.api.HelloApiHandler import HelloApiHandler
from flask import Flask, jsonify, render_template, request, redirect, url_for
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pathlib
from wishlist import *
from datetime import datetime


load_dotenv()
template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
template_dir = os.path.join(template_dir, 'frontend')
template_dir = os.path.join(template_dir, 'build')
app = Flask("app", root_path="wishlist",
            template_folder=template_dir, static_folder=template_dir, static_url_path='/')

CORS(app)  # comment this on deployment
api = Api(app)

logging.basicConfig(filename="app.log",
                    format='%(asctime)s %(message)s',
                    filemode='w')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@app.errorhandler(404)
def serve(path):
    statpath = app.static_folder

    print(statpath)

    return render_template('index.html')


@app.route("/submitwish", methods=["POST"], strict_slashes=False)
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

    client = MongoClient('localhost', 27017)
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


@app.route("/GetWishes", methods=["GET"], strict_slashes=False)
def getWishes():

    client = MongoClient('localhost', 27017)
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


@app.route("/GetWishlists", methods=["GET"], strict_slashes=False)
def getWishlists():

    client = MongoClient('localhost', 27017)
    mydatabase = client.wish
    mycollection = mydatabase.wishes
    try:
        lists = mycollection.distinct("wishlist")
    except Exception as e:
        logger.info("Error getting distinct wishlists %s", e)

    # wishes = mycollection.find({})
    # logger.info(json_util.dumps(wishes))
    return json_util.dumps(lists)


@ app.route('/go_outside_flask/<path:link>', strict_slashes=False)
def go_outside_flask_method(link):

    return link
