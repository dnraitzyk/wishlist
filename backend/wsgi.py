from app import flaskapp as application
import os
print("python path ", os.environ['PYTHONPATH'])
if __name__ == "__main__":
    application.run(debug=True)
