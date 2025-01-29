import json
import os
import re
import sys

# import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS

sys.path.append(os.path.join(sys.path[0], '..'))
from api.mysql_connector import MySQLDAO
from api.validation import validate_menu

app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
# logging.getLogger('flask_cors').level = logging.DEBUG

db = 'db.json'

mysqlDAO = MySQLDAO()


@app.route('/')
def hello_world():
    return '<p>Hello, World!</p>'


@app.route('/api/<collection>', methods=['GET', 'POST'])
def principales(collection):
    if request.method == 'GET':
        repo = mysqlDAO.get_repository()
        if repo is None or collection not in repo:
            abort(404)
        return jsonify(repo[collection])
    else:
        return save_collection(collection)


def save_collection(collection):
    if collection not in ['sides', 'principales', 'sopas']:
        abort(400)
    repo = mysqlDAO.get_repository()
    if repo is None:
        abort(500)
    repo[collection] = request.json
    if mysqlDAO.save_repository(json.dumps(repo)):
        return jsonify({'success': 'success', 'collection': collection})
    abort(500)


@app.route('/api/week_menu', methods=['GET', 'POST'])
def week_menu():
    """
    For this method, we will get the initial Sunday of the week in YYYY-MM-DD format from the qs
    """
    week = request.args.get('week')
    if week is None:
        abort(400)

    try:
        validate_week(week)
    except DateValidationException:
        abort(400, 'Not a valid date. Use YYYY-MM-DD')

    if request.method == 'GET':
        return fetch_week_menu(week)
    else:
        return save_week_menu(week, request.json)


def fetch_week_menu(week: str):
    week_from_db = mysqlDAO.get_menu(week)
    if week_from_db is None:
        week_from_db = []
    return jsonify(week_from_db)


def save_week_menu(week, menu):
    validate_menu(menu)
    mysqlDAO.save_menu(week, menu)
    return jsonify({'success': 'success', 'menu': menu, 'week': week})


class DateValidationException(Exception):
    pass


date_regex = re.compile('^[0-9]{4}-[0-9]{2}-[0-9]{2}$', re.I)


def validate_week(week: str):
    match = date_regex.match(str(week))
    if bool(match):
        return True
    raise DateValidationException('Start of week not in correct format. Use YYYY-MM-DD')
