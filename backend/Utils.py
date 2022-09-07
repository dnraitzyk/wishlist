# import argparse
from .Wish import *
# import logging
# from bs4 import BeautifulSoup
# import app
# import requests
# import os
# from pymongo import MongoClient, UpdateOne


# client = MongoClient('localhost', 27017)
# connstring = os.environ.get('MONGODB_URI')
# try:
#     if connstring is None:
#         client = MongoClient('localhost', 27017)
#     else:
#         client = MongoClient(connstring)

# except Exception as e:
#     print("Unable to connect to the server.", e)
#     logger.error("Unable to connect to the server.", e)
# mydatabase = client.wish
# mycollection = mydatabase.wishes


# Create and configure logger
# logging.basicConfig(filename="app.log",
#                     format='%(asctime)s %(message)s',
#                     filemode='w')

# logger = logging.getLogger()
# logger.setLevel(logging.ERROR)

# TODO clean up and try to find common element to stem from


def mapWishToDBRecord(Wish):
    recordDict = {
        "name": Wish.name,
        "description": Wish.description,
        "cost": Wish.cost,
        "quantity": Wish.quantity,
        "category": Wish.category,
        "link": Wish.link,
        "wishlist": Wish.wishlist,
        "wishlistLink": Wish.wishlistLink,
        "availability": Wish.availability,
        "id": Wish.id,
        "source": "auto",
        "modified_date": Wish.modified_date
    }
    return recordDict
    # logger.info(soup.prettify())


def saveWishesDB(recordList):
    # recordListGood = []
    # for record in recordList:
    #     logger.info("record name %s", record["name"])
    #     if record["name"] != "":
    #         recordListGood.append(record)
    #         logger.info("appending record %s", record["name"])
    #     else:
    #         logger.info("not appending record %s", record["name"])
    logger.info("inserting " + str(len(recordList)) + " records")

    # ids = [record.pop("id") for record in recordList]

    # operations = [UpdateOne({"id": idn}, {'$set': data}, upsert=True)
    #               for idn, data in zip(ids, recordList)]
    # mycollection.bulk_write(operations)
    Wish.objects.insert(recordList)
