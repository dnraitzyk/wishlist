# import logging
from bs4 import BeautifulSoup
from .Wish import *
from .wishlist import *
import requests
import re

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)


def getAllExternal():
    try:
        print("run REI")
        getReiWishes()
    except Exception as e:
        logger.error("Error getting rei wishlist %s", e)

    try:
        print("run amazon")
        getAmazonWishes()
    except Exception as e:
        logger.error("Error getting amazon wishlist %s", e)


def getReiWishes():
    wishlistlink = "https://www.rei.com/lists/415791132"
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
        # mappedwish = mapWishToDBRecord(
        #     Wish(namestring, itemdesc, itemcost, itemquantity, link=itemlink, wishlist="Rei", wishlistLink=wishlistlink, availability=""))
        # reiWishObjs.append(mappedwish)
        id = wishlist + "_" + namestring.replace(" ", "_").lower()
        wishToSave = Wish(name=namestring, description=itemdesc, cost=itemcost, quantity=itemquantity, link=itemlink,
                          wishlist=wishlist, wishlistLink=wishlistlink, id=id, availability=itemstock, source="auto", modified_date=datetime.today())
        reiWishObjs.append(wishToSave)
    saveWishesDB(reiWishObjs)
    # logger.info(reiWishObjs)


def getAmazonWishes():
    wishlistlink = "https://www.amazon.com/hz/wishlist/ls/3M5WRZQLL8Z1U?ref_=wl_share"
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
            id = wishlist + "_" + itemname.replace(" ", "_").lower()
            wishToSave = Wish(name=itemname, cost=itemcost, link=itemlink,
                              wishlist=wishlist, wishlistLink=wishlistlink, id=id, availability=itemavail, source="auto", modified_date=datetime.today())
            amazWishObjs.append(wishToSave)

        # print(amazitems)

        saveWishesDB(amazWishObjs)
    else:
        logger.error("Encountered captcha, wait 1 minute")
