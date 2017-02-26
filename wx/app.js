//app.js
App({
    onShow: function() {
        var that=this;
        that.checkData();
        that.getLoc();
    },
    globalData: {
        getLocationFreq: 1000*2, //获取位置频率(毫秒)
        checkDataFreq: 1000*60*2, //检查数据个数频率(毫秒)
        countMax: 60,
    },
    checkData: function() {
        var that=this;
        console.log('check...');
        var recording=wx.getStorageSync('recording');
        var countStorage=wx.getStorageSync('count');
        var count=countStorage ? parseInt(countStorage) : 0;
        if ((!recording&&count>0)||count>=that.globalData.countMax) {
            var keys=wx.getStorageInfoSync().keys;
            var i=0, j=0, datetime=[], lon=[], lat=[];
            while (i<that.globalData.countMax&&j<keys.length) {
                if (keys[j][0]==='t'&&keys[j].match(/\d{10}/)) {
                    datetime.push(keys[j].match(/\d{10}/)[0]);
                    var t=wx.getStorageSync(keys[j]).split(',');
                    lon.push(t[0]);
                    lat.push(t[1]);
                    i+=1;
                }
                j+=1;
            }
            for (var i=0;i<datetime.length;i++) {
                wx.removeStorageSync('t'+datetime[i]);
            }
            wx.setStorageSync('count', count-datetime.length);
            var name=wx.getStorageSync('user_name')
            if (name&&datetime.length>=1) {
                wx.request({
                    url: 'https://wxapp.tiankun.me',
                    data: {
                    'user_id': name,
                    'datetime': datetime.join(),
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
                    wx.setStorageSync('count', count+datetime.length);
                    for (var i=0;i<datetime.length;i++) {
                        wx.setStorage({
                        key: 't'+datetime[i],
                        data: lon[i]+','+lat[i],
                        success: function(res){
                        }
                        })
                        console.log('send data fail, rollback');
                    }
                    },
                    complete: function() {
                    setTimeout(that.checkData, that.globalData. checkDataFreq);
                    }
                })
            } else {
                setTimeout(that.checkData, that.globalData. checkDataFreq);
            }
        } else {
            setTimeout(that.checkData, that.globalData.checkDataFreq);
        }
    },
    getLoc: function() {
        var that=this;
        var recording=wx.getStorageSync('recording');
        if (recording) {
            wx.getLocation({
                type: 'wgs84', 
                success: function(res){
                    wx.setStorage({
                    key: 't'+Math.floor((new Date()).getTime()/1000),
                    data: res.longitude+','+res.latitude,
                    success: function(res){
                        console.log('add one row!');
                        var tmp=wx.getStorageSync('count');
                        var count=tmp? parseInt(tmp)+1 : 1;
                        wx.setStorageSync('count', count);
                    },
                    })
                },
                complete: function() {
                    setTimeout(that.getLoc, that.globalData.getLocationFreq);
                }
            })
        } else {
            setTimeout(that.getLoc, that.globalData.getLocationFreq);
        }
    }
})