#!/usr/bin/python
# -*- coding=UTF-8 -*-
# trickysky
# 2017/2/21

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
]