// pages/listpage/listpage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL:app.data.IMG_URL,
    loadingOver:false,
    pageType:99,
    goodsList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pageType = options.pageType;
    that.setData({
      pageType: pageType
    })
  },
  onShow:function(){
    var that = this;
    that.setData({
      loadingOver: false
    })
    that.loadData();
    setTimeout(function () {
      that.setData({
        loadingOver: true
      })
    }, 1000)
  },
  onReady:function(){
    var that = this;
  },

  loadData:function(){
    var that = this;
    var pageType = that.data.pageType;
    if (pageType == 1) {
      wx.setNavigationBarTitle({
        title: '新品'
      })
      var data = { orgID: app.globalData.ORG_ID };
      var dataJson = JSON.stringify(data);
      wx.request({
        url: app.data.API_URL + '/cms/goods/getNewProduct.action',
        data: { json: dataJson },
        success: function (res) {
          var data = res.data;
          that.setData({
            goodsList: data.goodsList,
          })
        }
      })
    } else if (pageType == 3) {
      wx.setNavigationBarTitle({
        title: '一元云购'
      })
      var data = { orgID: app.globalData.ORG_ID };
      var dataJson = JSON.stringify(data);
      wx.request({
        url: app.data.API_URL + '/cms/oneGoBuy/oneGoBuylist.action',
        data: { json: dataJson },
        success: function (res) {
          var data = res.data;
          that.setData({
            goodsList: data.goodsList,
          })
        }
      })
    } else if (pageType == 0) {
      wx.setNavigationBarTitle({
        title: '秒杀'
      })
      var data = { orgID: app.globalData.ORG_ID, pageType: pageType };
      var dataJson = JSON.stringify(data);
      wx.request({
        url: app.data.API_URL + '/cms/goods/seckill.action',
        data: { json: dataJson },
        success: function (res) {
          var data = res.data.data;
          that.setData({
            goodsList: data.secKillGoodsList,
            secKillTime: data.secKillTime,
          })
          that.getCountDown(data.secKillTime / 1000);
        }
      })
    }
  },



  goodsDetailJump:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var isClick = e.currentTarget.dataset.isclick;
    var goodsList = that.data.goodsList;
    var goodsID = goodsList[index].goodsID;
    var pageType = that.data.pageType;
    if (isClick==0){
      return
    }
    if (goodsList[index].oneGoBuyID){
      var oneGoBuyID = goodsList[index].oneGoBuyID;
      wx.navigateTo({
        url: '../../pages/goodsdetail/goodsdetail?goodsID=' + goodsID + '&pageType=' + pageType + '&oneGoBuyID=' + oneGoBuyID,
      })
    }else{
      wx.navigateTo({
        url: '../../pages/goodsdetail/goodsdetail?goodsID=' + goodsID + '&pageType=' + pageType,
      })
    }
    
  },




  getCountDown:function (timestamp){
    var that = this;
    var countdown=setInterval(function() {
      var nowTime = new Date();
      var endTime = new Date(timestamp * 1000);

      var t = endTime.getTime() - nowTime.getTime();
      if (t == 0 || t < 0 ){
         t = 0;
        var goodsList = that.data.goodsList;
        for (var i = 0; i < goodsList.length; i++){
          goodsList[i].isClick = 0;
        }
        that.setData({
          goodsList: goodsList
        })
        clearInterval(countdown);
      }
      var hour = Math.floor(t / 1000 / 60 / 60 % 24);
      var min = Math.floor(t / 1000 / 60 % 60);
      var sec = Math.floor(t / 1000 % 60);

      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      var countDownTime = hour + ":" + min + ":" + sec;
      that.setData({
        secKillTime: countDownTime,
        loadingOver: true
      })
    }, 1000);
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
      path: 'pages/index/index',
    }
  },

})

// #542e19