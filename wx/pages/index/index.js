var ini_lon=116.3325815066;
var ini_lat=40.0008488354;
var max_count=60*5;

var recording=false;
wx.setStorageSync('recording', false);
var btn_type = recording ? 'warn' : 'primary';
var stat_text = recording ? '停止记录' : '开始记录';
var count;
function getLoc(){
  wx.getLocation({
    type: 'wgs84',
    success: function(res){
      wx.setStorage({
        key: 't'+Math.floor((new Date()).getTime()/1000),
        data: res.longitude+','+res.latitude,
        success: function(res){
          count +=1;
          wx.setStorage({
            key: 'count',
            data: count,
            success: function(res){
              // success
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
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
  var schedule_id=setInterval(getLoc, 1000);
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
Page({
  data: {
    longitude: ini_lon,
    latitude: ini_lat,
    scale: 1,
    btn_type: btn_type,
    stat_text: stat_text,
    location_authority: !false
  },
  onLoad: function() {
    var that=this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res){
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          scale: 16,
          location_authority: !true
        })
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  onReady: function() {
    var count_value=wx.getStorageSync('count');
    count=count_value ? parseInt(count_value) : 0
    if ((!recording&&count>0)||count>=max_count) {
      
    }
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
