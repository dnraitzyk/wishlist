from datetime import datetime
import logging
from mongoengine import Document, StringField, URLField, IntField, DecimalField, DateTimeField

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class Wish(Document):
    name = StringField(required=True, max_length=256)
    description = StringField(max_length=256)
    cost = DecimalField(required=True, min_value=0)
    quantity = IntField(required=True, min_value=0)
    category = StringField(required=True, max_length=256)
    link = StringField(required=True, max_length=256)
    wishlist = StringField(required=True, max_length=256)
    wishlistLink = StringField(required=True, max_length=256)
    id = StringField(required=True, max_length=256, primary_key=True)
    availability = StringField(max_length=20)
    source = StringField(max_length=10)
    owner = StringField(required=True, max_length=256)
    modified_date = DateTimeField(required=True)
    needed_by_date = DateTimeField()

    def setNeededByDate(self, value):
        self.needed_by_date = value
    # def __str__(self):
    #     return str("name: " + self.name + " description: " + self.description + " cost: " + self.cost + " quantity: " + self.quantity + " category: " + self.category + " link: " + self.link + " wishlist: " + self.wishlist + " wishlistLink: " + self.wishlistLink + " id: " + self.id + " availability: " + self.availability + " source: " + self.source + " owner: " + self.owner + " modified_date: " + self.modified_date)

    def __str__(self):
        return str("name: " + self.name + " description: " + self.description + " id: " + self.id)
