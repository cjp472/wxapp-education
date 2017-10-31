// pages/distribution/team.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    totalNum:0,
    teamInfo:[{title:"一级分销商",num:0,level:1},
      { title: "二级分销商", num: 0, level: 2 },
      { title: "三级分销商", num: 0, level: 3 },
      ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var teamInfo = that.data.teamInfo;
    var data = { userID: app.globalData.userID,level:4 };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL+'/cms/home/myTeam.action',
      data: { json: dataJson},
      success:function(res){
        var data = res.data;
        teamInfo[0].num = data.one;
        teamInfo[1].num = data.two;
        teamInfo[2].num = data.three;
        that.setData({
          totalNum: data.sum,
          teamInfo: teamInfo,
          userInfo: app.globalData.userInfo
        })
      }
    })
  },


  teamDetail:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index
    var teamInfo = that.data.teamInfo;
    var level = teamInfo[index].level;
    wx.navigateTo({
      url: 'teamdetail?level=' + level,
    })
  },

  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: app.globalData.wxName,
      path: 'pages/index/index',
    }
  },


})