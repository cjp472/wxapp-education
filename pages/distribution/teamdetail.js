// pages/distribution/teamdetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distributor: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var level = options.level;
    if (level==1){
      wx.setNavigationBarTitle({
        title: '一级分销商',
      })
    } else if (level == 2){
      wx.setNavigationBarTitle({
        title: '二级分销商',
      })
    } else if (level == 3) {
      wx.setNavigationBarTitle({
        title: '三级分销商',
      })
    }
    var data = { userID: app.globalData.userID, level: level };
    var dataJson = JSON.stringify(data);
    console.log(dataJson);
    wx.request({
      url: app.data.API_URL + '/cms/home/myTeam.action',
      data: { json: dataJson },
      success: function (res) {
        var data = res.data;
        that.setData({
          distributor: data.distributor
        })
      }
    })
  },

  
})