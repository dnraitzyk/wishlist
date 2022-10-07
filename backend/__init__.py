# from backend import *
# from Wishlist import *
# import User.User
# import external.getAllExternal
# from . import getAllExternal
import logging
import json
from bson import json_util
from pymongo import MongoClient
from backend.User import User
from flask_pymongo import PyMongo
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
from backend.Utils import *
from datetime import datetime
load_dotenv()

print("running app.py name is + ", __name__)
guard = flask_praetorian.Praetorian()
mongo = PyMongo()


def create_app():
    print("running createapp")
    isheroku = os.environ.get('ISHEROKU')
    port = int(os.environ.get('PORT'))

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
        backenddir = os.path.dirname(os.path.abspath(__file__))
        # print("maindir")
        # print(maindir)
        # backenddir = os.path.join(maindir, 'backend')
        # template_dir = os.path.join(template_dir, 'frontend')
        template_dir = os.path.join(os.path.dirname(backenddir), 'build')
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

    flaskapp = Flask(__name__, root_path="wishlist",
                     template_folder=template_dir, static_folder=template_dir, static_url_path='/')
    # flaskapp = Flask(__name__, instance_relative_config=False)
    # flaskapp.config.from_object('config.Config')

    connstring = os.environ.get('MONGO_URI')
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

    # mongo.init_app()
    print("running __init__.py name is ", __name__)

    load_dotenv()
    print("port is ", port)

    # logger.info(os.listdir(template_dir+"/"))

    # template_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

    # IS_DEV = os.environ.get('FLASK_ENV') == "development"

    # flaskapp = Flask("app", root_path="wishlist",
    #                  template_folder=template_dir, static_folder=template_dir, static_url_path='/')
    flaskapp.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

    cors = CORS(flaskapp)  # comment this on deployment
    api = Api(flaskapp)

    flaskapp.config["SECRET_KEY"] = "gurble911scurblemcflurble123@!"
    flaskapp.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
    flaskapp.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
    flaskapp.config["PRAETORIAN_ROLES_DISABLED"] = True

    # def route_error_page_to_app(e):
    #     return render_template('index.html'), 404
    # flaskapp.register_error_handler(
    #     404, route_error_page_to_app)

    guard.init_app(flaskapp, User)

    with flaskapp.app_context():
        # Include our Routes
        from . import routes

        # Register Blueprints
        flaskapp.register_blueprint(routes.route_blueprint)
        # app.register_blueprint(admin.admin_bp)

        return flaskapp

        # return flaskapp

# if app.use_reloader:
#     logger.info("run german thing")
# The app is not in debug mode or we are in the reloaded process


print("after createapp")
logger = logging.getLogger()

# logger.setLevel(logging.INFO)
# app.config.from_object('config')


print("end of init")
# User(username="test", password=guard.hash_password('test'), lastName="testlast",
#      firstName="testfirst", email="test@test1.com", id="test").save()
