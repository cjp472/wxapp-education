var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawNum:"0",
    commissionInfo: []
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = { userID: app.globalData.userID}
    var dataJson = JSON.stringify(data);
    wx.request({
      url:app.data.API_URL + '/cms/home/getCommission.action',
      data: { json: dataJson},
      success:function(res){
        var data = res.data;
        that.setData({
          withdrawNum: data.withdrawNum,
          commissionInfo: data.total
        })
      }
    })
  },

  withdraw:function(e){
    var withdrawNum = e.currentTarget.dataset.withdrawnum
    wx.navigateTo({
      url: 'withdraw?withdrawNum=' + withdrawNum,
    })
  }

})