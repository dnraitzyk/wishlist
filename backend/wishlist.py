import argparse
from backend.Wish import Wish
import logging
from bs4 import BeautifulSoup
import app
import requests
import re
from pymongo import MongoClient


client = MongoClient('localhost', 27017)
mydatabase = client.wish
mycollection = mydatabase.wishes

desc = ""
cost = 0
location = ""
quantity = 0

record = {
    'description': desc,
    'cost': cost,
    'location': location,
    'quantity': quantity
}

rec = mycollection.insert_one(record)
# rec = myTable.insert_one(record)


# Create and configure logger
logging.basicConfig(filename="app.log",
                    format='%(message)s',
                    filemode='w')

# Creating an object
logger = logging.getLogger()
logger.setLevel(logging.INFO)


class app():

    def __init__(self):
        self.message = 'Hello world!'
        print("test")

    print("testapp")
    wish = Wish()
    # logger.info("log test")
# logger.info(args)


reiwishlist = requests.get("https://www.rei.com/lists/415791132")

# with open("index.html") as fp:
#     soup = BeautifulSoup(fp, 'html.parser')

soup = BeautifulSoup(reiwishlist.content, 'html.parser')
reiitems = soup.find_all("tr", class_="list-item list-body-item")

for row in reiitems:
    itemname = row.td.find_all("p", class_="product__title")
    unicode_string = str(itemname[0].string).strip()
    logger.info(unicode_string)
# logger.info(soup.prettify())

amazonwishlist = requests.get(
    "https://www.amazon.com/hz/wishlist/ls/3M5WRZQLL8Z1U?ref_=wl_share")

# with open("index.html") as fp:
#     soup = BeautifulSoup(fp, 'html.parser')

soup = BeautifulSoup(amazonwishlist.content, 'html.parser')
amazitems = soup.find_all("a", id=re.compile('^itemName_'))
# logger.info(soup)
# logger.info(len(amazitems))

for row in amazitems:
    itemname = row.string
    unicode_string = str(itemname).strip()
    logger.info(unicode_string)
