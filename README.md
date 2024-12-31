## Running the server

```
pip install -r requirements.txt
```


Run the server:

```
FLASK_APP=server FLASK_DEBUG=true flask run
```


## Running the UI


```
cd ui
yarn
yarn start
```


## Storing data

The weekly menu is a JSON object that will look like this:

```JSON
[
  // Sunday
  {
    "lunch": {
      "main": "world",
      "side": "world",
      "soup": "world"
    },
    "dinner": {
      "main": "world"
    }
  }
]
```


The database is just going to be a single table with the following schema:

```sql
CREATE TABLE IF NOT EXISTS weekmenu(
  start_of_week DATE NOT NULL PRIMARY KEY,
  menu JSON
);
```
