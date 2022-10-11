# import logging
from bs4 import BeautifulSoup
from .wish import Wish
from .wishlist import Wishlist
from .Utils import *
import requests
import re
import traceback
import json
from pymongo.errors import BulkWriteError
from mongoengine.queryset.visitor import Q


# logger = logging.getLogger()
# logger.setLevel(logging.INFO)


def replaceSpecialCharacters(text):
    specialChars = {"’": "'"}

    for key, value in specialChars.items():
        if key in text:
            text.replace(key, value)
    return text


def getAllExternal():

    # Figure out which lists from the wish table dont have corresponding links in wishlist table and delete
    lists = json.loads(Wishlist.objects.to_json())
    distinctlistsdb = Wish.objects(
        source="auto").distinct("wishlistLink")
    comparelinkslist = []
    for list in lists:
        comparelinkslist.append(list['link'])

    operatinglinkdict = {}
    for link in comparelinkslist:
        operatinglinkdict[link] = "update"
    for link in distinctlistsdb:
        if link in comparelinkslist:
            operatinglinkdict[link] = "update"
        else:
            operatinglinkdict[link] = "delete"

    print(operatinglinkdict)
    for testlink, action in operatinglinkdict.items():
        if action == "update":
            if "rei.com/lists" in testlink:
                try:
                    print("run REI")
                    getReiWishes(testlink)
                except Exception as e:
                    logger.error("Error getting rei wishlist %s",
                                 e, traceback.format_exc())
            elif "amazon.com/hz/wishlist" in testlink:
                try:
                    print("run amazon")
                    getAmazonWishes(testlink)
                except Exception as e:
                    logger.error("Error getting amazon wishlist %s", e)
            else:
                logger.info("Link " + testlink + " not recognized to update")
        elif action == "delete":
            print("Deleting wishes for link ", testlink)
            Wish.objects((Q(source="auto") & Q(
                wishlistLink=testlink))).delete()
        else:
            logger.error(
                "List action was not delete or update for link" + testlink)


def getReiWishes(wishlistlink):
    try:
        # wishlistlink = "https://www.rei.com/lists/415791132"
        owner = "defaultuser"
        wishlist = "Rei"
        try:
            reiwishlist = requests.get(wishlistlink)
        except Exception as e:
            print("Exception in getReiWishes to website%s", e)
            logger.error("Exception in getReiWishes to website%s", e)
            return
        baselink = "https://www.rei.com"
        soup = BeautifulSoup(reiwishlist.content, 'lxml')
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
                if itemstock == "In stock":
                    itemstock = "In"
                if itemstock == "No longer available":
                    itemstock = "Out"
            if len(pricerdchildren) > 1:
                itemcost = str(
                    pricerdchildren[1].string).strip().replace("$", "")
            for i in range(0, len(rowdivs)):
                divchildren = list(rowdivs[i].children)

                if str(divchildren[2].string) != "None":
                    itemdesc = str(divchildren[2].string).strip()

            relitemlink = list(rowdivs)[0].a['href']
            itemlink = baselink + relitemlink

            namestring = str(itemname[0].string).strip()

            itemquantity = row.find(
                "div", class_="list-item__quantity").p.contents[0].strip()
            # mappedwish = mapWishToDBRecord(
            #     Wish(namestring, itemdesc, itemcost, itemquantity, link=itemlink, wishlist="Rei", wishlistLink=wishlistlink, availability=""))
            # reiWishObjs.append(mappedwish)
            id = wishlist + "_" + namestring.replace(" ", "_").lower()
            wishToSave = Wish(name=namestring, description=itemdesc, cost=itemcost, quantity=itemquantity, link=itemlink,
                              wishlist=wishlist, wishlistLink=wishlistlink, id=id, availability=itemstock, source="auto", modified_date=datetime.today(), owner=owner)
            reiWishObjs.append(wishToSave)

        saveWishesDB(reiWishObjs)

    # logger.info(reiWishObjs)
    except BulkWriteError as bwe:
        print(bwe.details)
        raise
    except Exception as e:
        logger.error("Exception in getReiWishes %s",
                     e, traceback.format_exc())


def getAmazonWishes(wishlistlink):
    try:
        # wishlistlink = "https://www.amazon.com/hz/wishlist/ls/3M5WRZQLL8Z1U?ref_=wl_share"
        owner = "defaultuser"
        baselink = "https://www.amazon.com"
        wishlist = "Amazon"
        amazwishlist = requests.get(wishlistlink)

        soup = BeautifulSoup(amazwishlist.text, 'lxml')
        if soup.find("input", {"id": "captchacharacters"}) is None:

            amazitemslist = soup.find("ul", {"id": "g-items"})
            amazitems = ""
            try:
                amazitems = list(amazitemslist.find_all(
                    "li", attrs={"data-id": True}))

            except Exception as e:
                # getAmazonWishes()
                logger.error("Exception in getAmazonWishes %s", e)
            amazWishObjs = list()

            for i in amazitems:
                itemname = i.find("a", id=re.compile("^itemName_"))['title']
                relitemlink = i.find("a", id=re.compile("^itemName_"))['href']
                itemlink = baselink + relitemlink
                itemcost = 0
                itemavail = "Out"
                try:
                    itemcost = float(
                        str(i.find("span", id=re.compile("^itemPrice_")).span.string).replace('$', ''))
                except AttributeError as e:
                    logger.error("No cost found for " + itemname)
                    logger.error("Cost error %s ", e)
                try:
                    if str(i.find("a", string=re.compile("Add to Cart")).string):
                        itemavail = "In"
                except AttributeError as e:
                    logger.error("No add to cart found for " + itemname)
                    logger.error("itemavail error %s ", e)

                # mappedwish = mapWishToDBRecord(Wish(
                #     itemname, cost=itemcost, link=itemlink, wishlist="Amazon", wishlistLink=wishlistlink, availability=itemavail))
                itemname = replaceSpecialCharacters(itemname)
                print("itemname is ", itemname)
                id = wishlist + "_" + itemname.replace(" ", "_").lower()

                wishToSave = Wish(name=itemname, cost=itemcost, link=itemlink,
                                  wishlist=wishlist, wishlistLink=wishlistlink, id=id, availability=itemavail, source="auto", modified_date=datetime.today(), owner=owner)
                amazWishObjs.append(wishToSave)

            # print(amazitems)

            saveWishesDB(amazWishObjs)
        else:
            logger.error("Encountered captcha, wait 1 minute")
    except Exception as e:
        logger.error("Exception in getAmazonWishes %s",
                     e, traceback.format_exc())
