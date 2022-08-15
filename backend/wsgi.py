from . import app
import os
print("python path ", os.environ['PYTHONPATH'])
if __name__ == "__main__":
    app.run(debug=False)
