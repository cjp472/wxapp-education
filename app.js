//app.js
App({
  data: {
    API_URL:'https://xcx.dgcckj.com/distribution_mall_cms',//正式118服务器
    IMG_URL: 'http://xcximage.dgcckj.com', //正式118图片服务器
    //API_URL:'http://192.168.0.100:8080/distribution_mall_cms',//100服务器
    //API_URL:'http://192.168.0.184:8090/distribution_mall_cms',//184服务器
    //API_URL: 'http://192.168.0.120:8080/distribution_mall_cms',//本地服务器
    // API_URL: 'http://192.168.0.136:8080/distribution_mall_cms',//136服务器
    //API_URL: 'http://yqh285.tunnel.qydev.com/distribution_mall_cms',//100域名服务器
    // inviterID:0,
  },
  onLaunch: function (options) {
    var that = this;
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  login: function (){
    var that = this;
    var getUserInfo = [];
    that.getUserInfo(function (userInfo) {
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
        data.inviterID = that.globalData.inviterID;
        data.orgID = that.globalData.ORG_ID;
        var dataJson = JSON.stringify(data);
        console.log('appjs----->inviterID------>' + that.globalData.inviterID);
        console.log('orgID------>' + data.orgID);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.data.API_URL + '/cms/home/weChat.action',
            data: {
              json: dataJson
            },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res);
              that.globalData.userID = res.data.userID
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getPageInfo:function(inviterID){
    getApp().globalData.inviterID = inviterID;
    console.log('getPageInfo----->inviterID------>' + inviterID);
    if (getApp().globalData.userID == null){
      getApp().login();
    }
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        lang: 'zh_CN',
        success: function(res) {
          that.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(that.globalData.userInfo);
        }
      });
    }
  },

  globalData: {
    wxName:"大山英语",//小程序名称
    ORG_ID: 2,//商户ID(唯一值)
    userInfo: null,
    userID:null,
    inviterID:0,
  },
})
