from app import flaskapp as application
import os
# print("python path ", os.environ['PYTHONPATH'])
from dotenv import load_dotenv

load_dotenv()
isheroku = os.environ.get('ISHEROKU')
if __name__ == "__main__":

    if isheroku:
        port = int(os.environ.get('PORT'))
    else:
        port = int(os.environ.get('PORT', 5000))

    # app.run(host='0.0.0.0', port=port)
    application.run(host='0.0.0.0', port=port)
    # application.run()
