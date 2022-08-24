from .external import *
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from mongoengine import connect
import os
import sys

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

logger = logging.getLogger()

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
    logger.error("Unable to connect to the server from job.", e)

try:
    client.admin.command('ping')
    logger.info('Data Base Connection Established during job........')

except ConnectionFailure as err:
    logger.error("Data Base Connection failed from job. Error: {err}")

try:
    getAllExternal()
except Exception as e:
    logger.error("Error getting external wishes during job %s", e)
