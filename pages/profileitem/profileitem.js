var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL: app.data.IMG_URL,
    pageType:0,
    isTitle:true,
    title: [],//订单选项卡数据
    tabWidth:"",//根据项目的数量给不同的宽度
    currentTab: 0,//tab选项卡选中的tab
    containerShow:0,//判断显示的页面(0:待付款,1:待收货,2:已完成)
    orderInfo:[],
    recAddress: [],
    addressJson:"",
    couponInfo:[
      { cont: 40, condGoods: "限定商品可用",condNum:"满400可用",useTime:"2017.7.5-2017.7.19"},
      { cont: 40, condGoods: "限定商品可用",condNum:"满400可用",useTime:"2017.7.5-2017.7.19"},
      { cont: 40, condGoods: "限定商品可用",condNum:"满400可用",useTime:"2017.7.5-2017.7.19"},
    ],
    weChatService: [{ size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 }, { size: 27 },],
    showMessage: false,
    messageContent: '',//提示信息
    oneBuyInfo: [],//一元码记录信息
    delete_message: {}, //记录删除订单返回的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pageType = options.pageType;
    that.setData({
      pageType: pageType,
    });
  },
  onShow: function (e){
    var that = this;
    var pageType = that.data.pageType
    var reData = that.showTab(pageType);
    var isTitle = reData.isTitle;
    if (isTitle) {
      var title = reData.title
      var titleNum = title.length;
      var tabWidth = that.data.tabWidth;
      tabWidth = "width:" + 100 / titleNum + "%;";
    }
    that.setData({
      title: title,
      isTitle: isTitle,
      tabWidth: tabWidth
    });
  },
  showTab: function (pageType){
    /* tab选项卡显示隐藏与宽度设置和标题的文字 */
    var that = this;
    var isTitle = true;
    if (pageType == 0) {
      var title = [{ name: "待付款" }, { name: "待收货" },{ name: "已完成" }];
      wx.setNavigationBarTitle({
        title: '我的订单'
      });
      var data = { userID: app.globalData.userID };
      var dataJson = JSON.stringify(data);
      wx.request({
        url: app.data.API_URL + '/cms/goodsOrder/getOrderList.action',
        data: { json: dataJson },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var data = res.data;
          console.log(data);
          that.setData({
            orderInfo: data.information
          });
        }
      });
    } else if (pageType == 1 || pageType == 2) {
      isTitle = false;
      wx.setNavigationBarTitle({
        title: '收货地址'
      })
      var data = { userID: app.globalData.userID };
      var dataJson = JSON.stringify(data);
      wx.request({
        url: app.data.API_URL + '/cms/goodsOrder/getRecvAddress.action',
        data: { json: dataJson },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var data = res.data;
          console.log(data);
          that.setData({
            recAddress:data.recvAddressInfo
          });
        }
      });
    } else if (pageType == 3) {
      var title = [{ name: "未使用" }, { name: "已使用" }];
      wx.setNavigationBarTitle({
        title: '优惠券'
      })
    } else if (pageType == 4) {
      isTitle = false;
      wx.setNavigationBarTitle({
        title: '积分中心'
      })
    } else if (pageType == 5) {
      isTitle = false;
      wx.setNavigationBarTitle({
        title: '一元码记录'
      });
      var data = { orgID: app.globalData.ORG_ID,userID: app.globalData.userID };
      var dataJson = JSON.stringify(data);
      wx.request({
        url: app.data.API_URL + '/cms/oneGoBuy/oneGoBuyRecord.action',
        data: { json: dataJson },
        success: function (res) {
          var data = res.data;
          that.setData({
            oneBuyInfo: data.info
          })
        }
      });
    } else if (pageType == 6) {
      isTitle = false;
      wx.setNavigationBarTitle({
        title: '客服中心'
      })
    }
    var reData = { "isTitle": isTitle, "title": title };
    return reData;
  },
  selectTab:function(e){
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

  bindCheckbox:function(e){
    var index = parseInt(e.currentTarget.dataset.index);
    var recAddress = this.data.recAddress;
    var addressID = recAddress[index].addressID;
    for (var i = 0; i < recAddress.length; i++){
      if(i == index){
        recAddress[i].IsDefault = true;
      }else{
        recAddress[i].IsDefault = false;
      }
    } 
    var data = { userID: app.globalData.userID, addressID: addressID };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/amendDefault.action',
      data: { json: dataJson},
      success:function(res){
        console.log(res);
      }
    })
    this.setData({
      recAddress: recAddress
    })
  },
  //返回订单页面传选中收货地址
  bacdOrderdetail:function(e){
    if (this.data.pageType == 2){
      return false;
    }
    var index = parseInt(e.currentTarget.dataset.index);
    var recAddress = this.data.recAddress;
    var pages = getCurrentPages(); 
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; 
    prevPage.setData({
      recInfo: recAddress[index] 
    })
    wx.navigateBack({
      delta:1
    })
  },
  //修改地址传JSON字符串
  paasAddressJson:function(e){
    var index = parseInt(e.currentTarget.dataset.index);
    var recAddress = this.data.recAddress;
    var addressJson = JSON.stringify(recAddress[index]);
    wx.navigateTo({
      url: "../../pages/addressedit/addressedit?editType=1&addressJson=" + addressJson
    })
  },
  //删除收货地址
  delAddress:function(e){
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var recAddress = this.data.recAddress;
    var addressID = recAddress[index].addressID;
    var data = { addressID: addressID };
    var dataJson = JSON.stringify(data);
    wx.showModal({
      content: '是否确认删除该收货地址？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.data.API_URL +'/cms/goodsOrder/deleteRecvAddress.action',
            data: { json: dataJson},
            header: {
              'content-type': 'application/json'
            },
            success:function(res){
              recAddress.splice(index, 1);
              //更新列表的状态
              that.setData({
                recAddress: recAddress
              });
            }
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  //拨打客服电话
  serviceCall:function(){
    wx.makePhoneCall({
      phoneNumber: '0769-23076312'
    })
  },
  //待付款去支付
  weChatPay:function(e){
    var that =this;
    var index = parseInt(e.currentTarget.dataset.index);
    var obligation = that.data.orderInfo.obligation;
    var goodsOrderNum = obligation[index].goodsOrderNum;
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
            that.showTab(0);
          },
          'fail': function (res) {
            that.showMessage('支付失败');
            wx.redirectTo({
              url: '../../pages/profileitem/profileitem?pageType=0',
            })
          }
        })
      }
    })
  },

  // 代付款中删除订单
  delete: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_id = that.data.orderInfo.obligation[index].goodsOrderNum;
    let data = { 'goodsOrderNum': goods_id };
    let data_json = JSON.stringify(data);

    wx.showModal({
      title: '是否真的删除订单',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.request({
            url: app.data.API_URL + '/cms/goodsOrder/deleteOrder.action',
            data: { json: data_json },
            success: function (res) {
              let datas = res.data;
              if (datas.success === true) {
                wx.showToast({
                  title: datas.msg,
                  icon: 'success',
                  duration: 1500,
                })
                // 刷新数据
                that.showTab(0);
              } else if (datas.success === false) {
                wx.showToast({
                  title: datas.msg,
                  icon: 'success',
                  duration: 1500
                })
              }
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  //确认收货
  comfRecv:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goodsOrderNum = that.data.orderInfo.waitForReceiving[index].goodsOrderNum;
    var data = { goodsOrderNum: goodsOrderNum };
    var dataJson = JSON.stringify(data);

    wx.showModal({
      title: '是否确认收货',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.request({
            url: app.data.API_URL + '/cms/goodsOrder/confirmDelivery.action',
            data: { json: dataJson },
            success: function (res) {
              var data = res.data;
              console.log(data);
              if (data.success) {
                // 刷新数据
                that.showTab(0);
              } else{
                that.showMessage(data.msg)
              }
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  //前往订单详情
  //已完成
  toFinishDetail:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var finishOrder = that.data.orderInfo.finishOrder;
    var goodsOrderNum = finishOrder[index].goodsOrderNum;
    wx.navigateTo({
      url: '../../pages/comorderdetail/comorderdetail?goodsOrderNum='+goodsOrderNum
    })
  },
  //待付款
  toOblDetail:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var obligation = that.data.orderInfo.obligation;
    var goodsOrderNum = obligation[index].goodsOrderNum;
    wx.navigateTo({
      url: '../../pages/comorderdetail/comorderdetail?goodsOrderNum='+goodsOrderNum
    })
  },
  //待收货
  toWaitFRevDetail:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var waitForReceiving = that.data.orderInfo.waitForReceiving;
    var goodsOrderNum = waitForReceiving[index].goodsOrderNum;
    wx.navigateTo({
      url: '../../pages/comorderdetail/comorderdetail?goodsOrderNum='+goodsOrderNum
    })
  },

  //一元码记录商品详情跳转
  goodsDetailJump:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var oneBuyInfo = that.data.oneBuyInfo;
    var goodsID = oneBuyInfo[index].goodsID;
    var oneGoBuyID = oneBuyInfo[index].periodID;
    wx.navigateTo({
      url: '../../pages/goodsdetail/goodsdetail?goodsID=' + goodsID + '&pageType=3&oneGoBuyID=' + oneGoBuyID,
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