// pages/about/about.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingOver: false,//启动是否加载完成
    IMG_URL: app.data.IMG_URL,
    tapInfo: [],//tap列表
    tapSelect: 0,//tap选中值，默认0
    markers: [{
      iconPath: "../../images/place.png",
      id: 0,
      latitude: 22.945220,
      longitude: 113.887900,
      width: 40,
      height: 40,
    }],
    contact:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow:function(){
    var that = this;
    var markers = that.data.markers;
    var data = { orgID:app.globalData.ORG_ID}
    var dataJson = JSON.stringify(data);
    wx.request({
      url:app.data.API_URL + '/cms/user/aboutOurList.action',
      data: { json: dataJson},
      success:function(res){
        var data = res.data.data;
        console.log(data);
        markers[0].latitude = data.tapInfo[2].latitude;
        markers[0].longitude = data.tapInfo[2].longitude;
        that.setData({
          tapInfo: data.tapInfo,
          contact: data.tapInfo[2],
          markers:markers
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        loadingOver: true
      })
    }, 1000)
  },
  //tap标签切换
  changeTap:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var tapSelect = index;
    that.setData({
      tapSelect: tapSelect
    })
  },


  mapClick:function(){
    var that = this;
    var contact = that.data.contact;
    var latitude = contact.latitude;
    var longitude = contact.longitude;
    wx.openLocation({
      // latitude: latitude,
      // longitude: longitude,
      latitude: 22.9615300000,
      longitude: 113.9086150000,
      name: contact.companyName,
      scale: 14
    });
  },

  phoneCall:function(){
    var that = this;
    var contact = that.data.contact;
    wx.makePhoneCall({
      phoneNumber: contact.contactWay
    })
  },
  //转发
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: app.globalData.wxName,
      path: 'pages/index/index'
    }
  },

})