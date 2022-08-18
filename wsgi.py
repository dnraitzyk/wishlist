from app import flaskapp as application
import os
# print("python path ", os.environ['PYTHONPATH'])
if __name__ == "__main__":
    port = int(os.environ.get("PORT"))
    # app.run(host='0.0.0.0', port=port)
    application.run(host='0.0.0.0', port=port)
