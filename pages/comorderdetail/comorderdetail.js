// pages/comorderdetail/comorderdetail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL: app.data.IMG_URL,
    loadingOver: true,//首次进入加载数据加载动画
    totalPrices:"",//订单总价
    goodsOrderNum:123456,//订单编号
    orderDetails:[],
    showMessage: false,
    messageContent: '',//提示信息
    oneClick:true,//一次点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var goodsOrderNum = options.goodsOrderNum;
    that.setData({
      goodsOrderNum:goodsOrderNum
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.loadComOrderDetail()
  },

  /* 加载订单详情 */
  loadComOrderDetail:function(){
    var that = this;
    var data = {goodsOrderNum:that.data.goodsOrderNum};
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/goodsOrderDetail.action',
      data: { json: dataJson },
      success: function (res) {
        that.setData({
          orderDetails:res.data.orderDetails,
          recInfo:res.data.recInfo,
          totalPrices:res.data.totalPrices
        })
      }
    });
  },


  //待付款订单支付
  weChatPay:function(){
    var that =this;
    var goodsOrderNum = that.data.goodsOrderNum;
    var data = { orgID: app.globalData.ORG_ID,userID: app.globalData.userID, goodsOrderNum: goodsOrderNum };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/miniAppsPay.action',
      data: { json: dataJson },
      success: function (res) {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          'success': function (res) {
            that.showMessage('支付成功');
            that.loadComOrderDetail()
          },
          'fail': function (res) {
            that.showMessage('支付失败');
          }
        })
      }
    })
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