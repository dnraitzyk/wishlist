print("running app.py name is + ", __name__)

# from backend.app import flaskapp as application
import os
# print("python path ", os.environ['PYTHONPATH'])
import sys
from dotenv import load_dotenv
print("running pre wsgi")

load_dotenv()
isheroku = os.environ.get('ISHEROKU')
print("running wsgi")
from backend import create_app
app = create_app()


if __name__ == "__main__":

    if isheroku:
        port = int(os.environ.get('PORT'))
        print("heroku port is ", port)
    else:
        port = int(os.environ.get('PORT', 5000))
        print("port is ", port)
    sys.stdout.flush()

    # app.run(host='0.0.0.0', port=port)
    app.run(host='0.0.0.0', port=port, debug=True)
    # application.run()
