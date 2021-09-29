from flask import Flask, jsonify, request
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

