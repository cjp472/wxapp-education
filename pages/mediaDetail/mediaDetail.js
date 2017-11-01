// pages/mediaDetail/mediaDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL:app.data.IMG_URL,//图片域名地址
    belongType:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var mediaID = options.mediaID;
    //belongType   1.音频  2.视频  5.咨询
    var belongType = options.belongType;
    that.setData({
      belongType,
      mediaID
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var mediaID = that.data.mediaID;
    var data = {mediaID:mediaID};
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/dashanEnglish/mediaDetails.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log('data--->'+data);
        mediaInfo = data.mediaInfo;
        console.log('mediaInfo--->'+mediaInfo);
        that.setData({
          mediaInfo:mediaInfo,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  //加载页面数据
  loadPage(){

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})