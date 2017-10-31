var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL: app.data.IMG_URL,
    loadingOver: false,
    shopcarList:[],
    minusStatuses: [],
    showEmpty:true,
    allGoodsCkb:1,
    toastHidden:true,
    allPrice:0,
    delBtnWidth: 100,
    showMessage: false,
    messageContent: '',//提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (e) {
    var that = this;
    that.initEleWidth();
    var data = { userID: app.globalData.userID };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/getShopCar.action',
      data: { json: dataJson},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        if (data.list.length>0){
          var showEmpty = that.data.showEmpty;
          showEmpty = false;
        }else{
          showEmpty = true;
        }
        that.setData({
          shopcarList: data.list,
          showEmpty: showEmpty
        });
        that.sum();
        that.bindSelectAll(1);
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

  //商品选择
  bindCheckbox: function (e) {
    var that = this;
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在shopcarList作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var shopCarSelt = this.data.shopcarList[index].shopCarSelt;
    var shopcarList = this.data.shopcarList;
    var shopCarID = shopcarList[index].shopCarID;
    // 对勾选状态取反
    if (shopCarSelt == 1){
      shopCarSelt = 0;
    }else{
      shopCarSelt = 1;
    }
    var data = { shopCarID: shopCarID, shopCarSelt: shopCarSelt };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/setModule.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.data.shopcarList[index].shopCarSelt = shopCarSelt;
        // 写回经点击修改后的数组
        that.setData({
          shopcarList: shopcarList
        });
        that.sum();
        that.bindSelectAll(1);
      }
    });
  },
  //商品数量加减
  bindMinus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.shopcarList[index].goodsNum;
    var shopCarID = this.data.shopcarList[index].shopCarID;
    
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }else{
      return false;
    }
    var data = { shopCarID: shopCarID, goodNum: num };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/operationShopCar.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log(data);
      }
    })
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var shopcarList = this.data.shopcarList;
    shopcarList[index].goodsNum = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      shopcarList: shopcarList,
      minusStatuses: minusStatuses
    });
    
    this.sum();
  },
  bindPlus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.shopcarList[index].goodsNum;
    var shopCarID = this.data.shopcarList[index].shopCarID;
    
    // 自增
    num++;
    var data = { shopCarID: shopCarID, goodNum: num };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/operationShopCar.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log(res);
      }
    })
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var shopcarList = this.data.shopcarList;
    shopcarList[index].goodsNum = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      shopcarList: shopcarList,
      minusStatuses: minusStatuses
    });
    
    this.sum();
  },
  bindManual: function(e){
    var index = parseInt(e.currentTarget.dataset.index);
    this.data.shopcarList[index].goodsNum = e.detail.value;
    var shopcarList = this.data.shopcarList;
    var num = this.data.shopcarList[index].goodsNum;
    var shopCarID = this.data.shopcarList[index].shopCarID;
    var data = { shopCarID: shopCarID, goodNum: num };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/operationShopCar.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log(data);
      }
    })
    this.setData({
      shopcarList: shopcarList,
    });
    this.sum();
  },
  //全选
  bindSelectAll: function (check) {
    var that= this;
    // 环境中目前已选状态取反环境中目前已选状态取反
    var allGoodsCkb = that.data.allGoodsCkb;
    // 购物车数据，关键是处理shopCarSelt值
    var shopcarList = that.data.shopcarList;
    // 遍历
    if (check ==1){
      for (var i = 0; i < shopcarList.length; i++) {
        if (shopcarList[i].shopCarSelt == 0){
          if (shopcarList[i].status == 0) {
            continue;
          }else{
            allGoodsCkb = 0;
            break;
          }
        }else{
          allGoodsCkb = 1;
        }
      }
      that.setData({
        allGoodsCkb: allGoodsCkb,
      });
      return false;
    }
    if (allGoodsCkb == 0){
      allGoodsCkb = 1
      var checkAll = 1;
    }else{
      allGoodsCkb = 0;
      var checkAll = 0;
    }
    var data = { userID: app.globalData.userID, checkAll: checkAll };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/goodsOrder/checkAll.action',
      data: { json: dataJson},
      success:function(res){
        for (var i = 0; i < shopcarList.length; i++) {
          shopcarList[i].shopCarSelt = allGoodsCkb;
        }
        that.setData({
          allGoodsCkb: allGoodsCkb,
          shopcarList: shopcarList
        });
        that.sum();
      }
    })
  },
  sum: function () {
    var that = this;
    var shopcarList = that.data.shopcarList;
    // 计算总金额
    var allPrice = 0;
    for (var i = 0; i < shopcarList.length; i++) {
      if (shopcarList[i].shopCarSelt ) {
        if (shopcarList[i].status == 0) {
          continue;
        }else{
          if (shopcarList[i].offerPrice){
            var price = shopcarList[i].offerPrice;
          }else{
            var price = shopcarList[i].userPrice;
          }
          var num = shopcarList[i].goodsNum;
          for (var j = 0; j < num; j++) {
            // allPrice += price;
            allPrice = parseFloat(allPrice) + parseFloat(price);
          }
        }
      }

      //保留小数点后两位
      var f = parseFloat(allPrice);
      if (isNaN(f)) {
        return false;
      }
      var f = Math.round(allPrice * 100) / 100;
      allPrice = f.toString();
      var rs = allPrice.indexOf('.');
      if (rs < 0) {
        rs = allPrice.length;
        allPrice += '.';
      }
      while (allPrice.length <= rs + 2) {
        allPrice += '0';
      }
    }
    
    // 写回经点击修改后的数组
    that.setData({
      shopcarList: shopcarList,
      allPrice: allPrice
    });
  },
  
  //结算
  bindCheckout: function () {
    var that = this;
    var shopcarList = that.data.shopcarList;
    var haveGoods = false;
    if (app.globalData.userID == null) {
      app.login();
      if (app.globalData.userID == null) {
        that.showMessage('登录失败');
        return;
      }
    }
    if (shopcarList.length == 0){
      that.showMessage('请至少选择一样商品');
      return;
    }else{
      for (var i = 0; i < shopcarList.length; i++) {
        if (shopcarList[i].shopCarSelt == 1) {
          haveGoods = true;
          break;
        } 
      }
      if (!haveGoods){
        that.showMessage('请至少选择一样商品');
        return;
      }
    }
    wx.navigateTo({
      url: '../../pages/orderdetail/orderdetail',
    })
  },
  

/* *************侧滑删除************* */

  touchS: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      for (var i = 0; i < this.data.shopcarList.length; i++) {
        this.data.shopcarList[i].moveStyle = "margin-left:0rpx";
      } 
      this.setData({
        // shopcarList: shopcarList,
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }

  },

  touchM: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;
      var moveY = e.touches[0].clientY;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;
      var disY = this.data.startY - moveY;

      var delBtnWidth = this.data.delBtnWidth;

      var moveStyle = "";
      var delStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        moveStyle = "margin-left:0rpx";
      } else if (disX > delBtnWidth / 2 && disY <30) {//移动距离大于0，文本层left值等于手指移动距离
        moveStyle = "margin-left:-" + 100 + "rpx";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            moveStyle = "margin-left:-" + 100 + "rpx";
          }
        }
      //获取手指触摸的是哪一项
      var  shopcarList = this.data.shopcarList;
      shopcarList[index].moveStyle = moveStyle;
      //更新列表的状态
      this.setData({
        shopcarList: shopcarList
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var disY = this.data.startY - endY;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var moveStyle = disX > delBtnWidth / 2 && disY < 30 ? "margin-left:-" + 100 + "rpx" : "margin-left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var shopcarList = this.data.shopcarList;
      shopcarList[index].moveStyle = moveStyle;
      //更新列表的状态
      this.setData({
        shopcarList: shopcarList
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var  scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    }
    catch (e) {
      return false;
    }
  },
  initEleWidth: function () {
    var  delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件
  delItem: function (e) {
    var that = this;
    //获取列表中要删除项的下标
    var index = e.currentTarget.dataset.index;
    var shopcarList = this.data.shopcarList;
    var shopCarID = shopcarList[index].shopCarID;
    wx.showModal({
      content: '是否确认删除此商品？',
      success: function (res) {
        if (res.confirm) {
          var data = { shopCarID: shopCarID };
          var dataJson = JSON.stringify(data);
          wx.request({
            url: app.data.API_URL + '/cms/goodsOrder/deleteShopCar.action',
            data: { json: dataJson },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var data = res.data;
              var showEmpty = that.data.showEmpty;
              //移除列表中下标为index的项
              shopcarList.splice(index, 1);
              if (shopcarList.length == 0) {
                showEmpty = true;
              }
              //更新列表的状态
              that.setData({
                shopcarList: shopcarList,
                showEmpty: showEmpty
              });
              that.sum();
            }
          })
        } else if (res.cancel) {
          return;
        }
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

