// pages/distribution/ranking.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: [{ name: "邀请人数排行榜" }, { name: "销售排行榜" }],
    currentTab:0,
    containerShow:0,
    inviterInfo :[],
    salesInfo : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = { orgID: app.globalData.ORG_ID };
    var dataJson = JSON.stringify(data);
    wx.request({
      url:app.data.API_URL + '/cms/home/ranking.action',
      data: { json: dataJson},
      success:function(res){
        var data = res.data;
        that.setData({
          inviterInfo:data.arr,
          salesInfo:data.arr2
        })
      }
    })
  },
  //选择卡选项
  selectTab: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var currentTab = that.data.currentTab;
    var containerShow = that.data.containerShow;
    currentTab = containerShow = index;
    that.setData({
      currentTab: currentTab,
      containerShow: containerShow
    });
  },

  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: app.globalData.wxName,
      path: 'pages/index/index',
    }
  },

})