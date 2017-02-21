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
        console.log('lon: '+res.longitude);
        console.log('lat: '+res.latitude);
        console.log('speed: '+res.speed);
        console.log('acc: '+res.accuracy);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          scale: 16
        })
      },
      fail: function() {
        console.error('get location error');
      },
      complete: function() {
      }
    })
  },
  home() {
    this.setData({
      longitude:121.4813014484,
      latitude:31.2337697830,
      markers: [{
        iconPath: "/image/location.png",
        id: 0,
        latitude: 31.2337697830,
        longitude: 121.4813014484,
        width: 50,
        height: 50
      }],
    })
  },
  mainTown() {
    this.setData({
      longitude:116.3325815066,
      latitude:40.0008488354,
      markers: [{
        iconPath: "/image/location.png",
        id: 0,
        latitude: 40.0008488354,
        longitude: 116.3325815066,
        width: 50,
        height: 50
      }],
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})
