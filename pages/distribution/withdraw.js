// pages/distribution/withdraw.js
var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['银行账户', '支付宝'],
    pickID:0,
    cardInputType:"number",
    cardNum:"",
    cardChange:false,
    maxWithdrawNum:0,
    realWithdrawNum:"",
    showMessage: false,
    messageContent: '',//提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var maxWithdrawNum = options.withdrawNum;
    that.setData({
      maxWithdrawNum: maxWithdrawNum
    })
  },

  inputMax:function(e){
    var that = this;
    // console.log(e);
    var value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    var maxWithdrawNum = that.data.maxWithdrawNum;
    if (value > maxWithdrawNum){
      value = maxWithdrawNum;
      that.showMessage("最多只能提现" + maxWithdrawNum +"元");
    }
    that.setData({
      realWithdrawNum: value
    })
  },
//支付账号选择
  bindPickerChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var cardInputType = "number";
    if (e.detail.value == 1){
      cardInputType = "text";
    }else{
      cardInputType = "number";
    }
    that.setData({
      pickID: e.detail.value,
      cardInputType: cardInputType
    })
  },

  cardInput:function(e){
    var that = this;
    var pickID = that.data.pickID;
    var value = e.detail.value;
    var cardChange = true;
    if(value!==""){
      var cardChange = true;
    }else{
      cardChange = false;
    }
    if (pickID == 0){
      for (var i = 0; i < 5; i++) {
        if (value.length <= 5 * i - 2 || value.length > 5 * i - 1) {
          value = value;
        } else {
          value = value + " ";
        }
      }
    }
    that.setData({
      cardNum: value,
      cardChange: cardChange
    })
  },

  cleanCardInput:function(){
    var that = this;
    that.setData({
      cardNum: "",
      cardChange: false
    })
  },

  // withdraw:function(){
  //   var that = this;
  //   var realWithdrawNum = that.data.realWithdrawNum;
  //   var maxWithdrawNum = that.data.maxWithdrawNum;
  //   if (realWithdrawNum > maxWithdrawNum){
  //     that.showMessage("最多只能提现" + maxWithdrawNum + "元");
  //     return;
  //   }
  //   console.log(realWithdrawNum);
  // },

  //提交form表单
  withdrawSubmit: function (e){
    var that = this;
    var accountType = that.data.pickID;
    console.log(accountType);
    var maxWithdrawNum = that.data.maxWithdrawNum;
    var data = e.detail.value;
    if (accountType == 0){
      accountType = 3 //银行卡
    } else if (accountType == 1){
      accountType = 2 // 支付宝
    }
    data.accountType = accountType;
    data.userID = app.globalData.userID
    var dataJson = JSON.stringify(data);
    if (data.money == ''){
      that.showMessage('请输入提现金额');
    } else if (data.money > maxWithdrawNum){
      that.showMessage('提现金额不可大于' + maxWithdrawNum +'元');
    }else{
      wx.request({
        url:app.data.API_URL + '/cms/user/confirmWithdraw.action',
        data: { json: dataJson },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:function(res){
          console.log(res);
          var data = res.data;
          if(data.success){
            that.showMessage('提现申请已提交,等待审核');
          }else{
            that.showMessage(data.msg);
          }
        }
      })
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