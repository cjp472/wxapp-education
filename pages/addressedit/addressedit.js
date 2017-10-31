// pages/addressedit/addressedit.js
var app = getApp();
var area = require('../../data/area');//地区数据
var p = 0, c = 0, d = 0//省市区选择index
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceName: [],//省份
    provinceSelIndex: '',//省份选择
    cityName: [],//城市
    citySelIndex: '',//城市选择
    districtName: [],//区县
    districtSelIndex: '',//区县选择
    cityEnabled: false,
    districtEnabled: false,
    showMessage: false,
    messageContent: '',//提示信息
    addressJson:[],
    editType:0,//0为增加收货地址,1为修改收货地址
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options.editType);
    // var editType = that.data.editType
    that.data.editType = options.editType;
    if (options.addressJson){
      var addressJson = JSON.parse(options.addressJson);
      that.setData({
        addressJson: addressJson
      })
    }
    that.setAreaData();
  },
  // 选择省
  changeProvince: function (e) {
    this.resetAreaData('province')
    p = e.detail.value
    this.setAreaData('province', p)
    if (this.data.editType==1){
      var addressJson = this.data.addressJson;
      addressJson.province = "";
      addressJson.city = "";
      addressJson.area = "";
      this.setData({
        addressJson: addressJson
      })
    }
  },
  // 选择市
  changeCity: function (e) {
    this.resetAreaData()
    c = e.detail.value
    this.setAreaData('city', p, c)
  },
  // 选择区
  changeDistrict: function (e) {
    d = e.detail.value
    this.setAreaData('district', p, c, d)
  },
  setAreaData: function (t, p, c, d) {
    switch (t) {
      case 'province':
        this.setData({
          provinceSelIndex: p,
          cityEnabled: true
        })
        break;
      case 'city':
        this.setData({
          citySelIndex: c,
          districtEnabled: true
        })
        break;
      case 'district':
        this.setData({
          districtSelIndex: d
        })
    }
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area;
    var provinceName = [];
    var provinceCode = [];
    for (var i = 0; i < province.length; i++) {
      provinceName.push(province[i].areaName)
    }
    this.setData({
      provinceName: provinceName,
    })
    // 设置市的数据
    var cityName = [];
    var cityCode = [];
    if (province[p].cities) {
      var city = province[p].cities;
      for (var i = 0; i < city.length; i++) {
        cityName.push(city[i].areaName)
      }
    }
    this.setData({
      cityName: cityName,
    })
    // 设置区的数据
    var districtName = [];
    var districtCode = [];
    if (city[c].counties) {
      var district = city[c].counties;
      for (var i = 0; i < district.length; i++) {
        districtName.push(district[i].areaName)
      }
    }
    this.setData({
      districtName: districtName,
    })
  },
  // 重置数据
  resetAreaData: function (type) {
    this.setData({
      districtName: [],
      districtSelIndex: '',
      districtEnabled: false
    })
    if (type == 'province') {
      this.setData({
        cityName: [],
        citySelIndex: ''
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

  //保存按钮校验和发送收货地址
  savePersonInfo: function (e) {
    var that = this;
    var editType = that.data.editType;
    var addressJson = that.data.addressJson;
    var data = e.detail.value
    var phoneRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.name == '') {
      that.showMessage('请输入姓名')
    } else if (!nameRule.test(data.name)) {
      that.showMessage('请输入中文名')
    } else if (data.phone == '') {
      that.showMessage('请输入手机号码')
    } else if (!phoneRule.test(data.phone)) {
      that.showMessage('手机号码格式不正确')
    } else if (data.province == '') {
      that.showMessage('请选择所在省')
    } else if (data.city == '') {
      that.showMessage('请选择所在市')
    } else if (data.address == '') {
      that.showMessage('请输入详细地址')
    } else {
      if (editType == 0){
        data.userID = app.globalData.userID;
        var dataJson = JSON.stringify(data);
        wx.request({
          url: app.data.API_URL + '/cms/goodsOrder/addAddress.action',
          //url:  'http://192.168.0.120/test/test.php',
          data: { json: dataJson},
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            that.showMessage(' 保存成功')
            wx.navigateBack({
              delta:1
            })
          },
          fail:function(res){
            that.showMessage(' 保存失败')
          }
        });
      } else if (editType == 1){
        data.addressID = addressJson.addressID;
        var dataJson = JSON.stringify(data);
        wx.request({
          url: app.data.API_URL + '/cms/goodsOrder/amendAddress.action',
          data: { json: dataJson },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            that.showMessage(' 保存成功')
            wx.navigateBack({
              delta: 1
            })
          },
          fail: function (res) {
            that.showMessage(' 保存失败')
          }
        });
      }
    }
  },

  
  
})