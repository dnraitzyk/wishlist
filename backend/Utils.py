import logging
from .wish import Wish

logger = logging.getLogger()
logger.setLevel(logging.INFO)


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


def saveWishesDB(recordList):

    logger.info("inserting " + str(len(recordList)) + " records")

    # operations = [UpdateOne({"id": idn}, {'$set': data}, upsert=True)
    #               for idn, data in zip(ids, recordList)]
    # mycollection.bulk_write(operations)
    print(recordList[1].__str__())
    if len(recordList) > 0:
        Wish.objects.insert(recordList)
