from datetime import datetime
import logging
from mongoengine import Document, StringField, DoesNotExist, BooleanField, URLField, IntField, DecimalField, DateTimeField
from bson.json_util import loads, dumps

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class RoleException(Exception):
    pass


allowed_roles = ["admin", "operator"]


class User(Document):

    username = StringField(required=True, max_length=256)
    password = StringField(required=True, max_length=256)
    lastName = StringField(required=True, max_length=256)
    firstName = StringField(required=True, max_length=256)
    email = StringField(required=True, max_length=256)
    id = StringField(required=True, max_length=256, primary_key=True)
    roles = StringField(max_length=256)
    is_active = BooleanField(default=True)

    @classmethod
    def lookup(cls, username):
        try:
            return User.objects(username=username).get()
        except DoesNotExist:
            return None

    @classmethod
    def identify(cls, id):
        try:
            return User.objects(id=loads(id)).get()
        except DoesNotExist:
            return None

    @property
    def rolenames(self):
        try:
            roles = self.roles
            if roles is not None:
                roles = self.roles.split(",")
                if set(roles).issubset(set(allowed_roles)):
                    return roles
                else:
                    raise RoleException
            else:
                raise RoleException
        except RoleException:
            return []

    @property
    def identity(self):
        return dumps(self.id)

    def is_valid(self):
        return self.is_active
