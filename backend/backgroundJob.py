from .external import *

try:
    getAllExternal()
except Exception as e:
    logger.info("Error getting external wishes during job %s", e)
