import time
import argparse
from tkinter import W
from backend.Wish import Wish
import logging
import json
from bson import json_util
from pymongo import MongoClient
from backend.api.HelloApiHandler import HelloApiHandler
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from dotenv import load_dotenv
import os
import pathlib

load_dotenv()
template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
template_dir = os.path.join(template_dir, 'frontend')
template_dir = os.path.join(template_dir, 'build')
print("template dir is " + template_dir)
app = Flask("app", root_path="wishlist",
            template_folder=template_dir, static_folder=template_dir, static_url_path='/')
# app = Flask("app", root_path="wishlist", static_url_path='',
#             static_folder='frontend\\build\\')
CORS(app)  # comment this on deployment
api = Api(app)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@app.errorhandler(404)
def serve(path):
    statpath = app.static_folder
    # statpath = pathlib.Path(__file__).parent.resolve(
    # ).parent.resolve().joinPath("\\frontend\\build")
    print(statpath)
    # print(pathlib.Path(__file__).parent.resolve().parent.resolve())
    # return send_from_directory(statpath, 'index.html')
    return render_template('index.html')

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve(path):
#     path_dir = os.path.abspath("../frontend/build")
#     print("pathdir is " + path_dir)  # path react build
#     if path != "" and os.path.exists(os.path.join(path_dir, path)):
#         # return send_from_directory(os.path.join(path_dir), path)
#         print("running if")
#         return render_template('index.html')
#     else:
#         print("running else")
#         print("path is " + path)
#         # return send_from_directory(os.path.join(path_dir), 'index.html')
#         return render_template('index.html')


@app.route("/submitwish", methods=["POST"], strict_slashes=False)
def addWish():
    itemname = request.json['name']
    quantity = request.json['quantity']
    cost = request.json['cost']
    link = request.json['link']
    category = request.json['category']
    description = request.json['description']
    wishlist = request.json['wishlist']

    # wish = Wish(
    #     name=itemname,
    #     quantity=quantity,
    #     cost=cost,
    #     link=link,
    #     category=category
    # )

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
        'wishlist': wishlist
    }

    rec = mycollection.insert_one(record)

    return jsonify("Successfully added wish")


@app.route("/getwishlists", methods=["GET"], strict_slashes=False)
def getWishlist():
    # name = request.json['name']
    # quantity = request.json['quantity']
    # baselink = request.json['baselink']

    # wish = Wish(
    #     name=itemname,
    #     quantity=quantity,
    #     cost=cost,
    #     link=link,
    #     category=category
    # )

    client = MongoClient('localhost', 27017)
    mydatabase = client.wish
    mycollection = mydatabase.wishes

    # record = {
    #     'description': description,
    #     'name': itemname,
    #     'cost': cost,
    #     'link': link,
    #     'quantity': quantity,
    #     'category': category,
    #     'wishlist': wishlist
    # }

    wishes = mycollection.find({})
    # for wish in wishes:
    #     wish[id] = wish.get('_id')
    #     wish.pop('_id')

    # print("python json is " + jsonify([wish for wish in wishes]))

    return json_util.dumps(wishes)


# @app.route('/<path:path>')
# def staticHost(self, path):
#     try:
#         return send_from_directory(app.static_folder, path)
#     except ~werkzeug.exceptions.NotFound as e:
#         if path.endswith("/"):
#             return send_from_directory(app.static_folder, path + "index.html")
#         raise e

# appobj = app(


# class app():

#     def __init__(self):
#         self.client = MongoClient('localhost', 27017)

# api.add_resource(HelloApiHandler, '/flask/hello')
