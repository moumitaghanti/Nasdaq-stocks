
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
    
import psycopg2
#import urllib.parse as urlparse
import urllib.parse
import os

app = Flask(__name__)
# ENV = 'Dev'

# if ENV == 'Dev':
#conn = psycopg2.connect("host=localhost dbname='Nasdaq' user=postgres password='MOU1sou2'")

# else:
url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
dbname = url.path[1:]
user = url.username
password = url.password
host = url.hostname
port = url.port

conn = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
        )
    #conn = psycopg2.connect("postgres://tewujffstcjcnb:5b0d1f76060f7859b241b5852c4f664d20aff122c5880214a0df5453e700edce@ec2-107-21-122-38.compute-1.amazonaws.com:5432/d9v0406hajq3cu")
    
cur = conn.cursor()
cur.execute('SELECT * FROM stocks')
one = cur.fetchone()
all_data = cur.fetchall()
#print(all_data)

app = Flask(__name__)

@app.route("/")
#def home():
#    return (f"Available Routes:<br/>")
def home():
    return render_template("index.html")


@app.route("/api/stocks")
def stocks():
    # ENV = 'Dev'
    # if ENV == 'Dev':
    #conn = psycopg2.connect("host=localhost dbname='Nasdaq' user=postgres password='MOU1sou2'")
    # else:
    url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
    dbname = url.path[1:]
    user = url.username
    password = url.password
    host = url.hostname
    port = url.port

    conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
            )

    cur = conn.cursor()
    cur.execute('SELECT * FROM stocks')
    
    results = cur.fetchall()

    conn.close()
    all_stocks = []
    for result in results:
        stock_dict = {}
        stock_dict["date"] = result[0]
        stock_dict["high"] = result[1]
        stock_dict["low"] = result[2]
        stock_dict["open"] = result[3]
        stock_dict["close"] = result[4]
        stock_dict["volume"] = result[5]
        stock_dict["adj_close"] = result[6]
        stock_dict["ticker"] = result[7]
        #print(result[0])
        all_stocks.append(stock_dict)

    return jsonify(all_stocks)



    # date = [result[0] for result in all_data]
    # high = [result[1] for result in all_data]

    # trace = {
    #    "x": date,
    #    "y": high,
    #    "type": "bar"
    # }
    # return jsonify(trace)
@app.route("/api/markets")
def markets():
    # ENV = 'Dev'
    # if ENV == 'Dev':
    #conn = psycopg2.connect("host=localhost dbname='Nasdaq' user=postgres password='MOU1sou2'")
    # else:
    url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
    dbname = url.path[1:]
    user = url.username
    password = url.password
    host = url.hostname
    port = url.port

    conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
            )

    #conn = psycopg2.connect("postgres://tewujffstcjcnb:5b0d1f76060f7859b241b5852c4f664d20aff122c5880214a0df5453e700edce@ec2-107-21-122-38.compute-1.amazonaws.com:5432/d9v0406hajq3cu")
    
    cur = conn.cursor()
    cur.execute('SELECT * FROM markets')
    
    results = cur.fetchall()

    conn.close()
    all_markets = []
    for result in results:
        markets_dict = {}
        markets_dict["date"] = result[0].strftime('%Y-%m-%d')
        markets_dict["high"] = result[1]
        markets_dict["low"] = result[2]
        markets_dict["open"] = result[3]
        markets_dict["close"] = result[4]
        markets_dict["volume"] = result[5]
        markets_dict["adj_close"] = result[6]
        markets_dict["market"] = result[7]
        #print(result[0])
        all_markets.append(markets_dict)

    return jsonify(all_markets)
    



if __name__ == "__main__":
    app.run()
