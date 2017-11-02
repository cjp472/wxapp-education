// pages/mediaDetail/mediaDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_URL:app.data.IMG_URL,//图片域名地址
    belongType:0,
    mediaID:0,
    playImg:"../../images/home_icon_play@2x.png",//音频播放按钮图片切换
    isPlaying:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    let mediaID = options.mediaID;
    console.log('mediaID---->'+mediaID);
    //belongType   1.音频  2.视频  5.咨询
    let belongType = options.belongType;
    that.setData({
      belongType,
      mediaID
    })
    that.loadPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('englishAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  //加载页面数据
  loadPage(){
    let that = this;
    let mediaID = that.data.mediaID;
    console.log('mediaID---->'+mediaID);
    let data = {mediaID:mediaID};
    let dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/dashanEnglish/mediaDetails.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        let mediaInfo = data.mediaInfo;
        console.log(mediaInfo);
        that.setData({
          mediaInfo:mediaInfo,
        });
      }
    });
  },


  audioPlay: function () {
    let that = this;
    let playImg = that.data.playImg;
    if(that.data.isPlaying){
      that.data.isPlaying = false;
      that.audioCtx.pause();
      playImg = '../../images/home_icon_play@2x.png'
      that.setData({
        playImg
      })
    }else{
      that.data.isPlaying = true;
      that.audioCtx.play();
      playImg = '../../images/home_icon_playing@2x.png'
      that.setData({
        playImg
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.wxName,
      path: 'pages/mediaDetail/mediaDetail?mediaID='+that.data.mediaID+'&belongType='+that.data.belongType,
      success: function(res) {
        that.showMessage('转发成功')
      },
      fail: function(res) {
        that.showMessage('转发取消或失败')
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

})