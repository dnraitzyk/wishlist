import time
import argparse
# from tkinter import W
# from backend import *
from backend.Wishlist import Wishlist
# from backend.User import User
from .external import getAllExternal
import logging
import json
from bson import json_util
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.objectid import ObjectId
from flask import jsonify, Response, render_template, make_response, request, send_file, redirect, url_for, send_from_directory
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
from flask import Blueprint
from backend import guard
route_blueprint = Blueprint('route_blueprint', __name__)
isheroku = os.environ.get('ISHEROKU')
# guard = flask_praetorian.Praetorian()

load_dotenv()

if isheroku:
    print("isheroku")
    currdir = os.path.dirname(os.path.dirname(__file__))
    print(currdir)
    # template_dir = os.path.abspath("./build/")
    # template_dir = os.path.abspath("../../frontend/build/")
    # template_dir = os.path.dirname(
    #     os.path.abspath(os.path.dirname(__file__) + "/../"))
    # print("template_dir")
    # print(template_dir)
    backenddir = os.path.join(currdir, 'backend')
else:
    backenddir = os.path.dirname(os.path.abspath(__file__))
    print(backenddir)
    # print("maindir")
    # print(maindir)
    # backenddir = os.path.join(maindir, 'backend')
    # backenddir = maindir
    # template_dir = os.path.join(os.path.dirname(backenddir), 'build')


@route_blueprint.route('/favicon.ico')
def favicon():
    # statpath = app.static_folder
    # return render_template('index.html')
    return send_from_directory(backenddir, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@route_blueprint.route('/', defaults={'path': ''})
@route_blueprint.route('/<path:path>')
def serve(path):
    # statpath = flaskapp.static_folder
    # logger.info("flaskapp.template_folder")
    # logger.info(flaskapp.template_folder)
    # logger.info("flaskapp.template_folder files are")
    # logger.info(os.listdir(flaskapp.template_folder))
    print("running slash path")
    print(path)
    # print(render_template('index.html'))
    # return send_from_directory(flaskapp.template_folder, 'index.html')

    return render_template('index.html')


@route_blueprint.app_errorhandler(404)
def showErrorPage(self):
    # can add @route_blueprint.route('/app', defaults={'path': ''}) to try catch call
    return render_template('index.html')
    # return make_response(render_template('error.html'), 404)


@route_blueprint.route('/login', methods=['POST'])
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


@route_blueprint.route('/refresh', methods=['POST'])
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


@route_blueprint.route('/protected')
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


@route_blueprint.route("/submitwish", methods=["POST"], strict_slashes=False)
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


@route_blueprint.route("/DeleteWish", methods=["POST"], strict_slashes=False)
@cross_origin()
def DeleteWish():

    id = request.get_json()

    try:
        remobj = Wish.objects.get(id=id)
        remobj.delete()
    except Exception as e:
        logger.error("Error removing wish %s", e)
        return jsonify({"status": "error", "message": "Error removing wish"})

    return jsonify("Successfully removed wish")


@route_blueprint.route("/GetWishes", methods=["GET"], strict_slashes=False)
@cross_origin()
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


@route_blueprint.route("/GetWishlists", methods=["GET"], strict_slashes=False)
@cross_origin()
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


@route_blueprint.route("/AddWishlist", methods=["POST"], strict_slashes=False)
@cross_origin()
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


@route_blueprint.route("/DeleteWishlist", methods=["POST"], strict_slashes=False)
@cross_origin()
def DeleteWishlist():

    id = request.get_json()

    try:
        remobj = Wishlist.objects.get(id=id)
        remobj.delete()
    except Exception as e:
        logger.error("Error removing wishlist %s", e)
        return jsonify({"status": "error", "message": "Error removing wishlist"})

    return jsonify("Successfully removed wishlist")


@route_blueprint.route("/FetchExternalWishes", methods=["GET"], strict_slashes=False)
@cross_origin()
def fetchExternalWishes():
    logger.info("running flask route FetchExternalWishes")
    try:
        getAllExternal()
    except Exception as e:
        logger.info("Error getting external wishes %s", e)

    wishes = Wish.objects.to_json()
    return wishes


@route_blueprint.route('/go_outside_flask/<path:link>', strict_slashes=False)
def go_outside_flask_method(link):

    return link
