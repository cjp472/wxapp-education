// pages/distribution/promotion.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    API_URL:app.data.API_URL,
    userInfo: [],
    showMessage: false,
    messageContent: '',//提示信息
    codePath: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.hideShareMenu()
    var orgID = app.globalData.ORG_ID;
    console.log('orgID-->'+orgID);
    console.log('inviterID-->' + app.globalData.userID);

    var data = { userID: app.globalData.userID, orgID: orgID, scene: app.globalData.userID, path: 'pages/index/index'};
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/home/getAccessToken.action',
      data: { json: dataJson},
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        that.setData({
          codePath: res.data.pic
        });
      }
    })
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.wxName,
      path: '/pages/index/index?inviterID=' + app.globalData.userID,
      success: function (res) {
        that.showMessage("转发成功");
      },
      fail: function (res) {
        that.showMessage("转发失败");
      }
    }
  },

  //显示提示消息
  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 3000)
  },


})