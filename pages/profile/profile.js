var app = getApp();
Page({

  data: {
    IMG_URL: app.data.IMG_URL,
    loadingOver: false,
    showMessage: false,
    messageContent: '',//提示信息
    userInfo:[],
    funcList: [],
    distribList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      console.log(userInfo);
      that.setData({
        userInfo: userInfo
      });
    });
  },


  onShow:function(){
    var that = this;
    that.loadList();
    setTimeout(function () {
      that.setData({
        loadingOver: true
      })
    }, 1000)
  },

  loadList:function(){
    var that = this;
    var data = { orgID: app.globalData.ORG_ID};
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL +'/cms/home/personal.action',
      data: { json: dataJson},
      success:function(res){
        console.log(res);
        that.setData({
          funcList: res.data.funcList,
          distribList: res.data.distribList,
        })
      }
    })
  },

  jumpDistribList:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var distribList = that.data.distribList;
    var pageType = distribList[index].pageType;
    if (pageType == 1){
      wx.navigateTo({
        url: '../../pages/distribution/team',
      })
    } else if (pageType == 2){
      wx.navigateTo({
        url: '../../pages/distribution/commission',
      })
    } else if (pageType == 3) {
      wx.navigateTo({
        url: '../../pages/distribution/promotion',
      })
    } else if (pageType == 4) {
      wx.navigateTo({
        url: '../../pages/distribution/ranking',
      })
    } else if (pageType == 5) {
      var data = { orgID: app.globalData.ORG_ID };
      var dataJson = JSON.stringify(data);
      wx.request({
        url:app.data.API_URL + '/cms/home/teamRewards.action',
        data: { json: dataJson},
        success:function(res){
          var data = res.data;
          wx.showModal({
            title: data.title,
            content: data.content,
            confirmText: '知道了',
            showCancel: false,
            confirmColor: '#f43131',
          })
        }
      })
    }
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
      path: 'pages/index/index' ,
      success: function (res) {
        that.showMessage("转发成功");
      },
      fail: function (res) {
        that.showMessage("转发失败");
      }
    }
  },
  
  //设置
  setting:function(){
    wx.navigateTo({
      url: '../../pages/setting/setting',
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

})