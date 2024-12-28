from flask import Flask, jsonify, request, abort
import json
from flask_cors import CORS
import logging


app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
# logging.getLogger('flask_cors').level = logging.DEBUG

db = 'db.json'

@app.route("/")
def hello_world():
	return "<p>Hello, World!</p>"

@app.route("/api/<collection>", methods=['GET', 'POST'])
def principales(collection):
	if request.method == 'GET':
		with open(db, 'r') as f:
			c = json.load(f)
		return jsonify(c[collection])
	else:
		return save_collection(collection)


def save_collection(collection):
	if collection not in ['sides', 'principales', 'sopas']:
		abort(400)
	with open(db, 'r') as f:
		c = json.load(f)
	c[collection] = request.json
	with open(db, 'w', encoding="utf-8", newline='\n') as fd:
		json.dump(c, fd, indent=4)
	return jsonify({'success': 'success', 'collection': collection})


@app.route("/api/week_menu", methods=['GET', 'POST'])
def week_menu():
	if request.method == 'GET':
		'''
		For this method, we will get the initial Sunday of the week in YYYY-MM-DD format from the qs
		'''
		week = request.args.get('week')
		if week is None:
			abort(400)
		return fetch_week_menu(week)
	else:
		return save_week_menu()

def fetch_week_menu(week: str):
	week_from_db = {}
	return jsonify(week_from_db)
	
def save_week_menu():
	menu = {}
	return jsonify({'success': 'success', 'menu': menu})

