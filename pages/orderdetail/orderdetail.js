// pages/orderdetail/orderdetail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL: app.data.IMG_URL,
    loadingOver: false,
    totalPrices:"",//订单总价
    // goodsID:0,//商品ID
    recInfo:[],
    orderDetails:[],
    showMessage: false,
    messageContent: '',//提示信息
    oneClick:true,
  },

  onLoad: function(options){
    var that = this;
    var goodsID = options.goodsID;
    console.log(goodsID);
    that.setData({
      goodsID
    })
  },
  onShow:function(){
    var that = this;
    var data = { userID: app.globalData.userID,goodsID:that.data.goodsID,specPropertyValueID:1,addressID:0 };
    var dataJson = JSON.stringify(data);
    // wx.request({
    //   url: app.data.API_URL + '/cms/goodsOrder/orderDetails.action',
    //   data: { json: dataJson },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var data = res.data
    //     that.setData({
    //       orderDetails: data.orderDetails,
    //       totalPrices: data.totalPrices,
    //       recInfo: data.recInfo,
    //     })
    //   }
    // });
    wx.request({
      url: app.data.API_URL + '/cms/dashanEnglish/orderCommit.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data
        console.log(data);
        that.setData({
          orderDetails: data.orderDetails,
          totalPrices: data.totalPrices
        })
        // that.setData({
        //   orderDetails: data.orderDetails,
        //   totalPrices: data.totalPrices,
        //   recInfo: data.recInfo,
        // })
      }
    });
  },
  
  onReady: function () {
    // wx.hideToast();
    var that = this;
    setTimeout(function () {
      that.setData({
        loadingOver: true
      })
    }, 1000)

  },
  //跳转去支付的页面
  goPay:function(){
    var that = this;
    var recInfo = that.data.recInfo;
    var oneClick = that.data.oneClick;
    if (!recInfo.addressID){
      that.showMessage("个人信息不能为空");
      return;
    }
    if (!oneClick) {
      return false;
    } else {
      that.data.oneClick = false;
    }
    var data = { userID: app.globalData.userID, addressID: recInfo.addressID };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/orderCreate.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data
        if (data.success){
          wx.showToast({
            title: '创建订单成功',
          })
          var data = { orgID: app.globalData.ORG_ID,userID: app.globalData.userID, goodsOrderNum: data.goodsOrderNum };
          var dataJson = JSON.stringify(data);
          wx.request({
            url: app.data.API_URL + '/cms/goodsOrder/miniAppsPay.action',
            data: { json: dataJson  },
            success: function (res) {
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: 'MD5',
                paySign: res.data.data.paySign,
                'success': function (res) {
                  that.showMessage('支付成功');
                  wx.switchTab({
                    url: '../../pages/index/index'
                  })
                },
                'fail': function (res) {
                  that.showMessage('支付失败');
                  wx.redirectTo({
                    url: '../../pages/profileitem/profileitem?pageType=0',
                  })
                }
              })
            },
            fail:function(res){
              console.log(res);
            }
          })
        }else{
          that.showMessage(data.msg);
          wx.showToast({
            icon:'loading',
            title: '创建订单失败',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }
      }
    });
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

  changeAddress(){
    var that = this;
    that.showMessage('该功能正在开发中')
  }
})