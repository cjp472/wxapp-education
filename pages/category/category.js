// pages/category/category.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL: app.data.IMG_URL,
    categoryInfo:[],
    currentTab: 0,
    goodsInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var data = { orgID: app.globalData.ORG_ID };
    var dataJson = JSON.stringify(data);
    //初次启动加载左边导航分类
    wx.request({
      url: app.data.API_URL + '/cms/goods/getGoodsCategory.action', 
      data: { json: dataJson},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // wx.hideToast();
        var data = res.data;
        // console.log(data[0].id);
        console.log(res);
        var categoryID = data.goodsCategory[0].categoryID;
        that.setData({
          categoryInfo:data.goodsCategory,
          currentTab: categoryID
        });
        var data = { categoryID: categoryID, orgID: app.globalData.ORG_ID};
        var dataJson = JSON.stringify(data);
        // 加载右边分类内容
        wx.request({
          url: app.data.API_URL + '/cms/goods/getGoods.action',
          data: { json:dataJson },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var data = res.data.data;
            that.setData({
              goodsInfo: data
            });
          }
        });
      }
    });
  },

  //按钮切换分类获取数据
swichTab: function (e) {
  var that =this;
  var categoryID = e.currentTarget.dataset.categoryid;
  var data = { categoryID: categoryID, orgID: app.globalData.ORG_ID };
  var dataJson = JSON.stringify(data);
  wx.request({
    //url: app.data.QH_URL + '/cms/home/getGoodsByCategoryID.action',
    url: app.data.API_URL + '/cms/goods/getGoods.action',
    data: { json: dataJson},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      var data = res.data.data;
      that.setData({
        currentTab: categoryID,
        goodsInfo: data
      });
      // console.log(data);
    }
  });
},

toGoodsDetail: function (e) {
  var that = this;
  var index = e.currentTarget.dataset.index;
  var goodsInfo = that.data.goodsInfo;
  var goodsID = goodsInfo[index].goodsID;
  wx.navigateTo({
    url: '../../pages/goodsdetail/goodsdetail?goodsID=' + goodsID,
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