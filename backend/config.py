from pymongo import MongoClient
import logging
from mongoengine import connect, disconnect
import os
from pymongo.errors import ConnectionFailure
import dotenv

logger = logging.getLogger()
dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)


def getDatabaseVersion(databaseVersion):
    if databaseVersion == "prod":
        os.environ["currentDBAlias"] = "wish"
        dotenv.set_key(dotenv_file, "currentDBAlias", "wish")
        return databaseVersion
    else:
        os.environ["currentDBAlias"] = "wishdev"
        dotenv.set_key(dotenv_file, "currentDBAlias", "wishdev")

        return "dev"


def configureDatabase():
    disconnect()

    databaseAlias = os.environ["currentDBAlias"]
    print("databaseAlias is " + databaseAlias)
    connstring = os.environ.get('MONGO_URI')
    logger.info("connstring is %s", connstring)
    try:

        connect(db=databaseAlias, host="localhost",
                port=27017, alias="default")

    except Exception as e:
        logger.error("Unable to connect to the server.", e)

    try:
        # client.admin.command('ping')
        print('Data Base Connection Established........')

        logger.info('Data Base Connection Established........')

    except ConnectionFailure as err:
        logger.error("Data Base Connection failed. Error: {err}")
