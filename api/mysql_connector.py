import json

import pyodbc

connection_string = (
    'DRIVER=MySQL ODBC 9.1 ANSI Driver;'
    'SERVER=localhost;'
    'DATABASE=meal_planner;'
    'UID=root;'
    'PWD=;'
    'charset=utf8mb4;'
)


class ConnectionNotInitializedException(Exception):
    pass


class MySQLDAO:
    conn = None

    def __init__(self):
        cnxn = pyodbc.connect(connection_string)
        cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
        cnxn.setencoding(encoding='utf-8')
        self.conn = cnxn

    def cursor(self):
        if self.conn is None:
            raise ConnectionNotInitializedException('No connection initialized')
        return self.conn.cursor()

    def save_menu(self, date, menu):
        if self.conn is None:
            raise ConnectionNotInitializedException('No connection initialized')
        menu_str = json.dumps(menu)
        cursor = self.cursor()
        cursor.execute('INSERT INTO weekmenu(start_of_week, menu) VALUES(?, ?)', date, menu_str)
        self.conn.commit()

    def get_menu(self, date: str):
        cursor = self.cursor()
        cursor.execute('SELECT * from weekmenu WHERE start_of_week = ?', date)
        row = cursor.fetchone()
        if row:
            jsonstr = row[1]
            parsed = json.loads(jsonstr)
            return parsed
        return None
