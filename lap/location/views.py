# coding=utf-8
from django.shortcuts import render
from django.http import JsonResponse
from location.models import Data
from datetime import datetime


# Create your views here.

def index(request):
    if request.method == 'POST':
        try:
            data = request.POST
            user_id = data['user_id']
            # 秒
            datetime_list = data['datetime'].split(';')
            longitude_list = data['longitude'].split(';')
            latitude_list = data['latitude'].split(';')
            for i in range(len(datetime_list)):
                Data(user_id=user_id, datetime=datetime.fromtimestamp(int(datetime_list[i])),
                     longitude=float(longitude_list[i]), latitude=float(latitude_list[i])).save()
            return JsonResponse({
                'code': 0,
                'msg': 'ok'
            })
        except Exception as e:
            print e
            return JsonResponse({
                'code': 102,
                'msg': 'insert data error'
            })
    else:
        return JsonResponse({
            'code': 101,
            'msg': 'method error'
        })
