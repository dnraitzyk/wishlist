import argparse
from backend.Wish import Wish
import logging
from bs4 import BeautifulSoup
import app
import requests
import re
from pymongo import MongoClient, UpdateOne


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


# Create and configure logger
logging.basicConfig(filename="app.log",
                    format='%(message)s',
                    filemode='w')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# TODO clean up and try to find common element to stem from


def getReiWishes():
    wishlistlink = "https://www.rei.com/lists/415791132"
    reiwishlist = requests.get(wishlistlink)
    baselink = "https://www.rei.com"
    soup = BeautifulSoup(reiwishlist.content, 'html.parser')
    reiitems = soup.find_all("tr", class_="list-item list-body-item")

    reiWishObjs = list()
    for row in reiitems:
        itemname = row.td.find_all("p", class_="product__title")
        rowdivs = row.td.find_all("div", class_="list-item__product")
        itemdesc = ""
        itemcost = 0
        pricerd = row.find("div", class_="list-item__price")
        pricerdchildren = pricerd.find_all("p")
        if len(pricerdchildren) > 0:
            itemstock = str(pricerdchildren[0].string).strip()
        if len(pricerdchildren) > 1:
            itemcost = str(pricerdchildren[1].string).strip().replace("$", "")
        for i in range(0, len(rowdivs)):
            divchildren = list(rowdivs[i].children)

            if str(divchildren[2].string) != "None":
                itemdesc = str(divchildren[2].string).strip()

        relitemlink = list(rowdivs)[0].a['href']
        itemlink = baselink + relitemlink

        namestring = str(itemname[0].string).strip()

        itemquantity = row.find(
            "div", class_="list-item__quantity").p.contents[0].strip()
        mappedwish = mapWishToDBRecord(
            Wish(namestring, itemdesc, itemcost, itemquantity, link=itemlink, wishlist="rei"))
        reiWishObjs.append(mappedwish)
    saveWishesDB(reiWishObjs)
    # logger.info("logging reiWishObjs")
    # logger.info(reiWishObjs)


def getAmazonWishes():
    wishlistlink = "https://www.amazon.com/hz/wishlist/ls/3M5WRZQLL8Z1U?ref_=wl_share"

    amazwishlist = requests.get(wishlistlink)

    soup = BeautifulSoup(amazwishlist.content, 'html.parser')
    amazitemslist = soup.find("ul", {"id": "g-items"})

    amazitems = ""
    try:
        amazitems = list(amazitemslist.find_all(
            "li", attrs={"data-id": True}))
    except AttributeError:
        getAmazonWishes()
    amazWishObjs = list()

    for i in amazitems:
        itemname = i.find("a", id=re.compile("^itemName_"))['title']
        print(itemname)

        mappedwish = mapWishToDBRecord(Wish(itemname, wishlist="amazon"))
        amazWishObjs.append(mappedwish)
    # print(amazitems)
    # for row in amazitems:
    #     print()
    # itemname = row.td.find_all("p", class_="product__title")
    # unicode_string = str(itemname[0].string).strip()
    # logger.info(unicode_string)

    saveWishesDB(amazWishObjs)


def mapWishToDBRecord(Wish):
    recordDict = {
        "name": Wish.name,
        "description": Wish.description,
        "cost": Wish.cost,
        "quantity": Wish.quantity,
        "category": Wish.category,
        "link": Wish.link,
        "wishlist": Wish.wishlist,
        "id": Wish.id,
        "source": "auto",
        "modified_date": Wish.modified_date
    }
    return recordDict
    # logger.info(soup.prettify())


def saveWishesDB(recordList):
    logger.info("inserting " + str(len(recordList)) + " records")

    ids = [record.pop("id") for record in recordList]

    operations = [UpdateOne({"id": idn}, {'$set': data}, upsert=True)
                  for idn, data in zip(ids, recordList)]
    mycollection.bulk_write(operations)


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
