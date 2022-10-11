print("running app.py name is + ", __name__)

import os
import sys
from dotenv import load_dotenv
from backend import create_app

load_dotenv()
isheroku = os.environ.get('ISHEROKU')

app = create_app()

if __name__ == "__main__":

    if isheroku:
        port = int(os.environ.get('PORT'))
        print("heroku port is ", port)
    else:
        port = int(os.environ.get('PORT', 5000))
        print("port is ", port)
    sys.stdout.flush()

    app.run(host='0.0.0.0', port=port, debug=True)
