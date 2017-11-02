// pages/levelText/levelText.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage:false,
    textList:[
      {
        title:'Thank you ___ your help.',
        list: [
          {name: false, value: 'A with'},
          {name: true, value: 'B for'},
          {name: false, value: 'C at'},
        ],
      },
      {
        title:'Thank you ___ your help.',
        list: [
          {name: false, value: 'A with'},
          {name: true, value: 'B for'},
          {name: false, value: 'C at'},
        ],
      },
      {
        title:'Thank you ___ your help.',
        list: [
          {name: false, value: 'A with'},
          {name: true, value: 'B for'},
          {name: false, value: 'C at'},
        ],
      },
      {
        title:'Thank you ___ your help.',
        list: [
          {name: false, value: 'A with'},
          {name: true, value: 'B for'},
          {name: false, value: 'C at'},
        ],
      },
      {
        title:'Thank you ___ your help.',
        list: [
          {name: false, value: 'A with'},
          {name: true, value: 'B for'},
          {name: false, value: 'C at'},
        ],
      },
      {
        title:'Thank you ___ your help.',
        list: [
          {name: false, value: 'A with'},
          {name: true, value: 'B for'},
          {name: false, value: 'C at'},
        ],
      },
    ]
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  submitText(){
    var that = this;
    wx.showToast({
      title: '恭喜完成测试',
      icon: 'success',
      duration: 3000,
      complete:function(){
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
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