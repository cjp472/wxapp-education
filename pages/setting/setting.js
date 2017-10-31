// pages/setting/setting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:"",//用户名
    phone:"",//手机号码
    userCode:"",//用户
    alipayAccount:"",//支付宝账号
    bankCard:"",//银行卡
    openBank:"",//银行类型
    bankBranch:"",//开卡支行
    disabled:false,//是否有默认数据
    isEdit:true,
    btnText:"提交",
    submitOnly:true,//提交事件一次点击
    showMessage: false,
    messageContent: '',//提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = { userID: app.globalData.userID };
    var dataJson = JSON.stringify(data);
    console.log(dataJson);
    wx.request({
      url: app.data.API_URL + '/cms/user/getMyInfo.action',
      data: { json: dataJson},
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        if(data.userName){
          console.log('data---->'+data);
          that.setData({
            userName: data.userName,
            phone: data.phone,
            userCode: data.userCode,
            alipayAccount: data.alipayAccount,
            bankCard: data.bankCard,
            openBank: data.openBank,
            bankBranch: data.bankBranch,
            disabled:true,
            isEdit:false,
            btnText:"修改"
          })
        }
      }
    })
  },
  trimStr:function(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

  submitInfo:function(e){
    var that = this;
    var btnText = that.data.btnText;
    if(btnText == '修改'){
      that.setData({
        disabled:false,
        isEdit:true,
        btnText:"保存"
      });
      return false;
    }
    if(that.data.submitOnly){
      that.data.submitOnly = false;
    }else{
      return false;
    }
    var data = e.detail.value
    var phoneRule = /^1[3|4|5|7|8]\d{9}$/  //电话号码
    var nameRule = /^[\u2E80-\u9FFF]+$/  //中文姓名
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/ //身份证
    var regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/ //邮箱
    var bankCardRule = /^(\d{16}|\d{19})$/  //银行卡
    data.userID = app.globalData.userID;
    console.log(data);
    var dataJson = JSON.stringify(data);
    if (data.userName == '') {
      that.showMessage('请输入姓名')
    } else if (!nameRule.test(that.trimStr(data.userName))) {
      that.showMessage('请输入中文名')
    } else if (data.phone == '') {
      that.showMessage('请输入手机号码')
    } else if (!phoneRule.test(that.trimStr(data.phone))) {
      that.showMessage('手机号码格式不正确')
    } else if (data.userCode == '') {
      that.showMessage('请输入身份证号码')
    } else if (!regIdCard.test(that.trimStr(data.userCode))) {
      that.showMessage('身份证号码不正确')
    } else if (data.alipayAccount == '' && data.bankCard == '') {
      that.showMessage('请输入支付宝或银行卡信息')
    } else if (data.bankCard !== '' && !bankCardRule.test(that.trimStr(data.bankCard))) {
      that.showMessage('银行卡账号不正确')
    } else if (data.bankCard !== '' &&  data.openBank =='') {
      that.showMessage('所属银行不能为空')
    } else if (data.bankCard !== '' && data.openBank !== '' && data.bankBranch == '') {
      that.showMessage('开户支行不能为空')
    }else{
      wx.request({
        url: app.data.API_URL +  '/cms/user/saveMyInfo.action',
        data: { json: dataJson},
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:function(res){
          if(res.data.success){
            that.setData({
              disabled:true,
              isEdit:false,
              btnText:"修改"
            })
          }
          that.showMessage(res.data.msg)
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
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