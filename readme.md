bash alias activate OR . activate in bash to activate flask venv

deactivate

flask run
export FLASK_ENV=development

TO RUN APP
python -m flask run, within main directory in venv
- this will run based off the current directory and the value of flask_app from env

HEROKU
Procfile needed, separate for windows

- runtime.txt, contains python version to use

Run Heroku locally
- heroku local -f Procfile.windows

Push to heroku, changes automatic from github
- git push heroku main

To view deployed heroku files
- heroku run bash -a wishlist-agg
- heroku logs