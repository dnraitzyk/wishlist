from backend import app
from flask.cli import FlaskGroup
import click

cli = FlaskGroup(app)

# manager = Manager(app)
# manager.add_command('server', Server)


@cli.command('run')
@click.argument('app', default='app*.py')
def run(app):
    print("testing manage", __name__)


if __name__ == '__main__':
    cli()
