. activate in bash to activate flask venv
deactivate
flask run
or export FLASK_ENV=development

TO RUN APP
python -m flask run within backend in venv

HEROKU
Procfile

runtime.txt

running heroku in bash
- winpty /c/"Program Files"/heroku/bin/heroku.cmd
- heroku local -f Procfile.windows
- git push heroku main
- heroku run bash -a wishlist-agg