from datetime import datetime
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class Wish():
    """Example function with types documented in the docstring."""

    def __init__(self, name="", description="", cost=0, quantity=1, category="default", link="", wishlist="default", wishlistLink="", availability=""):
        self.name = name
        self.description = description
        self.cost = cost
        self.quantity = quantity
        self.category = category
        self.link = link
        self.wishlist = wishlist
        self.wishlistLink = wishlistLink
        self.id = wishlist+"_"+name.replace(" ", "_").lower()
        self.availability = availability
        self.modified_date = datetime.today()
