#!/usr/bin/python
# -*- coding=UTF-8 -*-
# trickysky
# 2017/2/22

from datetime import datetime
from flask import Flask, jsonify, request
from model import Data, pg_db
import ast

app = Flask(__name__)
key_file = r'/Users/tk/applet/openssl/tiankun.me.key'
crt_file = r'/Users/tk/applet/openssl/tiankun.me.crt'
context = (crt_file, key_file)


@app.route("/", methods=['POST', 'GET'])
def hello():
    if request.method == 'POST':
        data = ast.literal_eval(request.data)
        user_id = data['user_id']
        # 秒
        datetime_list = data['datetime'].split(',')
        longitude_list = data['longitude'].split(',')
        latitude_list = data['latitude'].split(',')
        pg_db.connect()
        pg_db.create_table(Data, True)
        for i in range(len(datetime_list)):
            Data.create(user_id=user_id, datetime=datetime.fromtimestamp(int(datetime_list[i])),
                        longitude=float(longitude_list[i]), latitude=float(latitude_list[i]))
            # print datetime_list[i], longitude_list[i], latitude_list[i]
        pg_db.close()
        return jsonify({
            'code': 0,
            'msg': 'ok'
        })
    else:
        return jsonify({
            'code': 101,
            'msg': 'method error!'
        })


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, threaded=True, ssl_context=context)
