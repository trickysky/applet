var lon=116.3325815066
var lat=40.0008488354
Page({
  data: {
    longitude: lon,
    latitude: lat,
    markers:[]
  },
  location() {
    var that = this
    var lon, lat, speed, accuracy;
    wx.getLocation({
      type: 'wgs84', 
      success: function(res){
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          scale: 16
        })
        var now=Math.floor((new Date()).getTime()/1000);
        wx.request({
          url: 'https://local.tiankun.me:8000/location',
          data: {
            'user_id': '2014210120',
            'datetime': now.toString(),
            'longitude': res.longitude.toString(),
            'latitude': res.latitude.toString()
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            console.log(res)
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
        console.error('get location error');
      },
      complete: function() {
      }
    })
  },
})
