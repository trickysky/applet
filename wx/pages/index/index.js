var ini_lon=116.3325815066, ini_lat=40.0008488354;

var locAuthority=false;
var recording=wx.getStorageSync('recording');
var btn_type = recording ? 'warn' : 'primary';
var stat_text = recording ? '停止记录' : '开始记录';
var name;

function recordAuthority(){
  return locAuthority&&wx.getStorageSync('user_name');
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
      that.setData({
        btn_type: 'primary',
        stat_text: '开始记录'
      })
    }
    else {
      wx.setStorageSync('recording', true);
      recording=true;
      that.setData({
        btn_type: 'warn',
        stat_text: '停止记录'
      })
    } 
  }
})
