var ini_lon=116.3325815066, ini_lat=40.0008488354;
var maxCount=5;  //发送阈值
var getLocationFreq=1000*1; //获取位置频率(毫秒)
var checkDataFreq=1000*5; //检查数据个数频率(毫秒)

var locAuthority=false;
var recording=false;
wx.setStorageSync('recording', false);
var btn_type = recording ? 'warn' : 'primary';
var stat_text = recording ? '停止记录' : '开始记录';
var name;
function getLoc(){
  wx.getLocation({
    type: 'wgs84',
    success: function(res){
      wx.setStorage({
        key: 't'+Math.floor((new Date()).getTime()/1000),
        data: res.longitude+','+res.latitude,
        success: function(res){
          var tmp=wx.getStorageSync('count');
          var count=tmp? parseInt(tmp) : 0;
          count +=1;
          wx.setStorage({
            key: 'count',
            data: count,
            success: function(res){
            },
            fail: function() {
            },
            complete: function() {
            }
          })
        },
        fail: function() {
        },
        complete: function() {
        }
      })
    },
    fail: function() {
      console.log('get location error');
      getLoc();
    },
    complete: function() {
    }
  })
}
function setSchedule() {
  clearSchedule();
  var schedule_id=setInterval(getLoc, getLocationFreq);
  wx.setStorage({
    key: 'schedule_id',
    data: schedule_id,
    success: function(res){
      console.log('set schedule_id success');
    },
    fail: function() {
      console.log('set schedule_id error');
    }
  })
}
function clearSchedule() {
  var schedule_id=wx.getStorageSync('schedule_id');
  if (schedule_id) {
    clearInterval(schedule_id);
    wx.removeStorage({
      key: 'schedule_id',
      success: function(res){
        console.log('remove schedule_id success');
      },
      fail: function() {
        console.log('remove schedule_id error');
      }
    })
  }
}
function checkData() {
  console.log('checking data count...');
  var tmp=wx.getStorageSync('count');
  var count=tmp? parseInt(tmp) : 0;
  if ((!recording&&count>0)||count>=maxCount) {
    var keys=wx.getStorageInfoSync().keys
    var i=0 ,k=0, date=[], lon=[], lat=[];
    while (k<maxCount&&i<keys.length) {
      if (keys[i][0]==='t'&&keys[i].match(/\d{10}/)){
        date.push(keys[i].match(/\d{10}/)[0]);
        var t=wx.getStorageSync(keys[i]).split(',');
        lon.push(t[0]);
        lat.push(t[1]);
        k+=1;
      }
      i+=1;
    }
    for (var j=0;j<date.length;j++) {
      wx.removeStorage({
        key: 't'+date[j],
        success: function(res){
        }
      })
    }
    wx.setStorageSync('count', count-date.length);
    count = wx.getStorageSync('count')
    if (date&&name) {
      wx.request({
        url: 'https://applet.tiankun.me:8000/',
        data: {
          'user_id': name,
          'datetime': date.join(),
          'longitude': lon.join(),
          'latitude': lat.join()
        },
        method: 'POST',
        success: function(res) {
          var r=res.data;
          if (r.code==0){
            console.log('send data success!')
          }
        }, 
        fail: function() {
          wx.setStorageSync('count', count+date.length);
          for (var i=0;i<date.length;i++) {
            wx.setStorage({
              key: 't'+date[i],
              data: lon[i]+','+lat[i],
              success: function(res){
              }
            })
            console.log('send data fail, rollback');
          }
        },
        complete: function() {
          setTimeout(checkData, checkDataFreq);
        }
      })
    } else {
      setTimeout(checkData, checkDataFreq);
    }
  } else {
    setTimeout(checkData, checkDataFreq);
  }
}
function recordAuthority(){
  return locAuthority&&wx.getStorageSync('user_name')
}
Page({
  data: {
    name: wx.getStorageSync('user_name'),
    longitude: ini_lon,
    latitude: ini_lat,
    scale: 1,
    btn_type: btn_type,
    stat_text: stat_text,
    recordAuthority: !recordAuthority()
  },
  onLoad: function() {
    name=wx.getStorageSync('user_name');
    var that=this;
    wx.getLocation({
      type: 'gjc02',
      success: function(res){
        locAuthority=true;
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          scale: 16,
          recordAuthority: !recordAuthority()
        });
      },
      fail: function() {
      },
      complete: function() {
      }
    })
    checkData();
  },
  setName: function(e) {
    var that=this;
    name=e.detail.value;
    wx.setStorageSync('user_name', name);
    that.setData({
      name: name,
      recordAuthority: !recordAuthority()
    });
  },
  record(){
    var that = this;
    if (recording) {
      wx.setStorageSync('recording', false);
      recording=false;
      clearSchedule();
      that.setData({
        btn_type: 'primary',
        stat_text: '开始记录'
      })
    }
    else {
      wx.setStorageSync('recording', true);
      recording=true;
      setSchedule();
      that.setData({
        btn_type: 'warn',
        stat_text: '停止记录'
      })
    } 
  }
})
