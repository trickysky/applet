#!/usr/bin/python
# -*- coding=UTF-8 -*-
# trickysky
# 2017/2/21
import requests, json

url = 'http://127.0.0.1:8000/location/'
data = {
    'f1': 'v1',
    'f2': 2,
    'f3': ['1', '22', 'asd']
}
jdata = json.dumps(data)
r = requests.post(url=url, data=data)
print r

