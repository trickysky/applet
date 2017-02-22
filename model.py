#!/usr/bin/python
# -*- coding=UTF-8 -*-
# trickysky
# 2017/2/22

from peewee import *

pg_db = PostgresqlDatabase('applet', user='applet')


class Data(Model):
    user_id = CharField()
    datetime = DateTimeField()
    longitude = FloatField()
    latitude = FloatField()

    class Meta:
        database = pg_db

pg_db.connect()
pg_db.create_table(Data, safe=True)
pg_db.close()
