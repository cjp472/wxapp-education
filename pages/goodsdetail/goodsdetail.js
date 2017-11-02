// pages/goodsdetail/goodsdetail.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL: app.data.IMG_URL,
    loadingOver:false,
    mainIMGHeight:"",
    //轮播图参数
    indicatorDots: true,
    indicatorActiveColor: '#ffffff',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsID:null,
    goodsData:[],
    goodsIMG:[],
    pageType:99,//页面类型“0:秒杀,2:一元云购”
    marketing:false,//是否显示营销模块
    oneBuyGoodsNum:1,
    oneBuyInfo: { "userName": "DBF_东", "luckyNum": "465321", "time": "2017-8-8 17:11" },
    shopCarNum: 0,//购物车数量
    addSuccess:true,
    detailsPicPath:[],//商品详情图
    showMessage: false,
    messageContent: '',//提示信息
    showModalStatus: false,//一元圆梦弹窗
    oneGoBuyID:0,//一元圆梦参数
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var goodsID = options.goodsID;
    
    if (options.pageType){
      var pageType = options.pageType;
      var marketing = false;
      if (pageType == 0 || pageType ==3){
        marketing = true;
      }
      if (options.oneGoBuyID){
        var oneGoBuyID = options.oneGoBuyID;
      }else{
        var oneGoBuyID = 0;
      }
      that.setData({
        goodsID: goodsID,
        pageType: pageType,
        marketing: marketing, 
        oneGoBuyID:oneGoBuyID
      })
    }else{
      that.setData({
        goodsID: goodsID,
      })
    }
    
  },
  onShow:function(){
    var that = this;
    if (app.globalData.userID == null) {
      that.login();
    }else{
      that.loadGoodsDetail();
    }
  },

  onReady:function(){

    var that = this;
    setTimeout(function () {
      that.setData({
        loadingOver: true
      })
    }, 1000)
  },


  //登录：确保先登录后调请求商品详情数据的接口，因为商品详情需要userID
  login:function(){
    var that = this;
    var getUserInfo = [];
    app.getUserInfo(function (userInfo) {
      getUserInfo = userInfo;
    })
    //微信登录
    wx.login({
      success: function (res) {
        var data = getUserInfo;
        if (data == ''){
          data = {};
        }
        data.code = res.code;
        data.orgID = app.globalData.ORG_ID;
        var dataJson = JSON.stringify(data);
        console.log('code--->' + data.code);
        console.log('orgID------>' + data.orgID);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.data.API_URL + '/cms/home/weChat.action',
            data: {
              json: dataJson
            },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res);
              app.globalData.userID = res.data.userID
              that.loadGoodsDetail();
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },




  //加载商品数据
  loadGoodsDetail:function(){
    var that = this;
    var data = { userID: app.globalData.userID, goodsID: that.data.goodsID, orgID: app.globalData.ORG_ID, pageType: that.data.pageType, oneGoBuyID: that.data.oneGoBuyID};
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goods/goodDetails.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var data = res.data
        that.setData({
          list: data.goodsPictureList,
          goodsData: data.info,
          detailsPicPath: data.detailsPicPath,
          shopCarNum: data.shopCarNum
        })
        if (data.lotteryInfo){
          that.setData({
            lotteryInfo: data.lotteryInfo,
            marketing:false
          })
        }
        if (data.info.secKillTime) {
          that.getCountDown(data.info.secKillTime / 1000);
        }
      }
    });
  },
  //购物车按钮跳购物车页面
  shopcarPage:function(){
    wx.switchTab({
      url: '../../pages/shopcar/shopcar'
    })
  },
  //客服跳转
  funcPage:function(){
    wx.navigateTo({
      url: '../../pages/profileitem/profileitem?pageType=' + 6,//客服
    })
  },
  //加入购物车
  addGoods:function(){
    var that = this;
    var addSuccess = that.data.addSuccess;
    var shopCarNum = that.data.shopCarNum;
    var data = { userID: app.globalData.userID, goodsID: that.data.goodsID, orgID: app.globalData.ORG_ID, pageType: that.data.pageType };
    var dataJson = JSON.stringify(data);
    if (!addSuccess){
      return false;
    }
    that.data.addSuccess = false;
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/addShop.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        
        if (res.data.success){
          if (shopCarNum < 99) {
            shopCarNum++;
          } else {
            shopCarNum = "99+";
          }
          that.setData({
            shopCarNum: shopCarNum
          })
          wx.showToast({
            title: '添加成功',
            duration: 200,
            mask: true,
            complete: function () {
              that.data.addSuccess = true;
            }
          })
        }else{
          that.showMessage('添加失败');
        }
      }
    });
    setTimeout(function () { that.data.addSuccess = true }, 300);
    
  },
  //不可加入购物车提示
  warmTips:function(){
    var that = this;
    that.showMessage('该商品已被抢空');
  },
  //立即购买
  // buyNow:function(){
  //   wx.navigateTo({
  //     url: '../../pages/orderdetail/orderdetail',
  //   })
  // },
  //转发
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.wxName,
      path: 'pages/goodsdetail/goodsdetail?goodsID=' + that.data.goodsID,
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


  //一元圆梦
  powerDrawer: function (e) {
    if (e.currentTarget){
      var currentStatu = e.currentTarget.dataset.statu;
    }else{
      var currentStatu = e
    }
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;
    // 第3步：执行第一组动画 
    animation.opacity(0).scale(0.5, 0.5).translate(-70,500).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).scale(1, 1).translate(0, 0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  //一元圆梦数量加减
  bindMinus:function(){
    var that = this;
    var oneBuyGoodsNum = that.data.oneBuyGoodsNum;
    if (oneBuyGoodsNum == 1){
      that.showMessage('至少需要购买一件');
      return;
    }
    oneBuyGoodsNum --;
    that.setData({
      oneBuyGoodsNum: oneBuyGoodsNum
    })
  },
  bindPlus: function () {
    var that = this;
    var oneBuyGoodsNum = that.data.oneBuyGoodsNum;
    var oneBuyResidue = that.data.oneBuyResidue;
    if (oneBuyGoodsNum == oneBuyResidue) {
      that.showMessage('最多可以购买' + + oneBuyResidue +'人次');
      return;
    }
    oneBuyGoodsNum++;
    that.setData({
      oneBuyGoodsNum: oneBuyGoodsNum
    })
  },
  bindManual:function(e){
    var that = this;
    var value = e.detail.value;
    var oneBuyResidue = that.data.oneBuyResidue;
    if (value == ''){
      that.showMessage('至少需要购买一件');
      that.setData({
        oneBuyGoodsNum: 1
      })
      return;
    }
    if (value > oneBuyResidue){
      that.showMessage('最多可以购买' + + oneBuyResidue + '人次');
      that.setData({
        oneBuyGoodsNum: oneBuyResidue
      })
      return;
    }
    that.setData({
      oneBuyGoodsNum: value
    })
  },

  oneBuyClick:function(){
    var that = this;
    var oneBuyGoodsNum = that.data.oneBuyGoodsNum;
    var oneGoBuyID = that.data.goodsData.oneGoBuyID;
    var goodsID = that.data.goodsData.goodsID;
    var data = { userID: app.globalData.userID, orgID: app.globalData.ORG_ID, num: oneBuyGoodsNum, oneGoBuyID: oneGoBuyID, goodsID: goodsID};
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/oneGoBuy/oneGoBuyWXpay.action',
      data: { json: dataJson},
      success:function(res){
        var tips = res.data.tips;
        if(res.data.success){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            'success': function (res) {
              that.showMessage('支付成功');
              that.powerDrawer('close');
              wx.showModal({
                title: '提示',
                content: tips,
                showCancel:false,
                confirmText:'知道了',
              })
              that.loadGoodsDetail();
            },
            'fail': function (res) {
              that.showMessage('支付失败');
              that.loadGoodsDetail();
            }
          })
        }else{
          that.showMessage(res.data.msg);
          that.powerDrawer('close');
          return;
        }
      }
    })
  },


  //秒杀倒计时
  getCountDown: function (timestamp) {
    var that = this;
    var countdown = setInterval(function () {
      var nowTime = new Date();
      var endTime = new Date(timestamp * 1000);

      var t = endTime.getTime() - nowTime.getTime();
      if (t == 0 || t < 0) {
        t = 0;
        var goodsData = that.data.goodsData;
        // goodsData.isClick == 0;
        that.setData({
          goodsData: goodsData
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
        secKillTime: countDownTime
      })

    }, 1000);
  },

  //页面跳转
  navTo(e){
    // console.log(e);
    var that = this;
    var link = e.currentTarget.dataset.link;
    switch(link){
      case 'levelText':
        wx.navigateTo({
          url: '../../pages/levelText/levelText',//水平测试
        })
        break;
      case 'addShopcar':
        that.showMessage('该功能正在开发中')
        break;
      case 'buyNow':
        wx.navigateTo({
          url: '../../pages/orderdetail/orderdetail?goodsID='+that.data.goodsID,//订单详情(立即购买)
        })
        break;
    }
  },
})