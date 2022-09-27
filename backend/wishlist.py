from datetime import datetime
import logging
from mongoengine import Document, StringField, URLField, IntField, DecimalField, DateTimeField

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class Wishlist(Document):
    name = StringField(required=True, max_length=256)
    baseLink = StringField(required=False, max_length=256)
    link = StringField(required=True, max_length=256)
    id = StringField(required=True, max_length=256, primary_key=True)
    owner = StringField(required=True, max_length=256)
    added_date = DateTimeField(required=True)
