from app import flaskapp as application
import os
# print("python path ", os.environ['PYTHONPATH'])
import sys
from dotenv import load_dotenv

load_dotenv()
isheroku = os.environ.get('ISHEROKU')
if __name__ == "__main__":

    if isheroku:
        port = int(os.environ.get('PORT'))
        print("heroku$$$$$$$$$$$$$$$$port ")
        print(port)
    else:
        port = int(os.environ.get('PORT', 5000))
        print("$$$$$$$$$$$$$$$$port ")
        print(port)
    sys.stdout.flush()

    # app.run(host='0.0.0.0', port=port)
    print("$$$$$$$$$$$$$$$$running wsgi app ")
    application.run(host='0.0.0.0', port=port, debug=True)
    # application.run()
