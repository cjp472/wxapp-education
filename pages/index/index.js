//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    reflashRun:false,
    loadingOver:false,
    IMG_URL:app.data.IMG_URL,//图片域名地址
    pageCount:1,//上拉加载分页器页数
    //轮播图参数
    indicatorDots: true,//轮播图指示点
    indicatorActiveColor: '#ffffff',//当前选中的指示点颜色
    autoplay: true,//轮播图自动播放
    interval: 3000,//轮播换图时间
    duration: 1000,//轮播滑动动画时长
    carousel: [],//轮播图
    purchase:[],//水平营销板块(已经废弃)
    funcList:[
      {image:'../../images/icon_homepage_about_us.png',title:'关于我们',pageType:99},
      {image:'../../images/icon_homepage_sign_in.png',title:'签到',pageType:100},
      {image:'../../images/icon_homepage_course.png',title:'课程',pageType:4},
      {image:'../../images/icon_homepage_service.png',title:'客服',pageType:98},
    ],//宫格营销模块
    flexInfo:[{"title":"热销商品"}],
    goodsInfo:[],  //商品信息
    pUpLoading:false,//上拉加载动画
    tabType:1,//1.热门咨询  2.优秀学员
    contentInfo:[],//咨询/视频和音频列表
  },
  
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          windowHeight:res.windowHeight
        })
      }
    })
    console.log("options-->scene" + options.scene);
    console.log("options-->inviterID" + options.inviterID);
    
    if (options.inviterID){
      app.getPageInfo(options.inviterID);
      console.log("options-->inviterID-->inviterID" + options.inviterID);
    } else if (options.scene){
      var inviterID = decodeURIComponent(options.scene)
      console.log("options-->scene-->inviterID" + inviterID);
      app.getPageInfo(inviterID);
    }else{
      app.getPageInfo(0);
    }
    that.loadIndex();
    
  },
  onReady:function(){
    // wx.hideToast();
    var that = this;
    setTimeout(function(){
      that.setData({
        loadingOver: true
      })
    },1000)
    wx.setNavigationBarTitle({
      title: app.globalData.wxName,
    })
    
  },

  //获取首页数据
  loadIndex:function(tabType=1){
    var that = this;
    var data = { orgID: app.globalData.ORG_ID,pageCount:1,tabType:tabType };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/dashanEnglish/getIndexTab.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log('text')
        console.log(data);
        
        that.setData({
          carousel: data.carouseInfo,
          contentInfo: data.contentInfo,
        });
        
        setTimeout(function(){
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading()
        }, 500)
      }
    });
  },

  //营销模块更具type值跳转页面
  funcPage:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var funcList = that.data.funcList;
    var pageType = funcList[index].pageType;
    console.log(pageType);
    switch (pageType) {
      case 100:
        //签到
        that.showMessage('该功能正在开发中')
        break;
      case 4:
        wx.switchTab({
          url: '../../pages/category/category',//分类
        })
        break;
      case 99:
        wx.navigateTo({
          url: '../../pages/about/about',//官网
        })
        break;
      case 98:
        wx.navigateTo({
          url: '../../pages/profileitem/profileitem?pageType='+ 6,//客服
        })
        break;
      case 97:
        wx.navigateTo({
          url: '../../pages/profileitem/profileitem?pageType='+ 0,//我的订单
        })
        break;
      case 96:
        wx.navigateTo({
          url: '../../pages/profileitem/profileitem?pageType='+ 2,//收货地址
        })
        break;
      default:
        wx.navigateTo({
          url: '../../pages/listpage/listpage?pageType=' + pageType,//listpage
        })
        break;
    }
  },

  // 前往商品详情
  toGoodsDetail: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goodsInfo = that.data.goodsInfo;
    var goodsID = goodsInfo[index].goodsID;
    wx.navigateTo({
      url: '../../pages/goodsdetail/goodsdetail?goodsID='+goodsID,
    })
  },

  // 热门资讯，优秀学员切换
  changeTab(e){
    console.log(e);
    var that = this;
    var tabType = e.currentTarget.dataset.tabtype;
      console.log(that.data.tabType == tabType)
    if(that.data.tabType == tabType){
        return;
    }
    this.setData({
      tabType:tabType
    })
    console.log('tabType---->'+tabType)
    that.loadTab(tabType);

  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading()
    that.loadIndex();
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

  //上拉加载
  onReachBottom:function(){
    var that = this;
    // var goodsInfo = that.data.goodsInfo;
    that.setData({
      pUpLoading: true,
    });
    console.log(that.data.pageCount)
    that.data.pageCount ++;
    console.log(that.data.pageCount)
    that.loadTab(that.data.tabType,that.data.pageCount);
  },


  //加载tabType内容
  loadTab(tabType,pageCount=1){
    var that = this;
    var contentInfo = that.data.contentInfo;
    var data = {orgID: app.globalData.ORG_ID,pageCount:pageCount,tabType:tabType}
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/dashanEnglish/getIndexTab.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if(pageCount == 1){
          that.setData({
            contentInfo:data.contentInfo,
            pUpLoading: false,
          });
          return;
        }
        if(data.contentInfo.length > 0){
          contentInfo = contentInfo.concat(data.contentInfo);
          console.log(contentInfo);
          that.setData({
            contentInfo:contentInfo,
            pUpLoading: false,
          });
        }else{
          that.setData({
            pUpLoading: false,
          });
        }
      }
    });
  },

  //咨询、视频、音频详情
  navToDetail(e){
    var that = this;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var contentInfo = that.data.contentInfo;
    var mediaID = contentInfo[index].mediaID;
    var belongType = contentInfo[index].belongType;
    console.log(belongType)
    wx.navigateTo({
      url: '../../pages/mediaDetail/mediaDetail?mediaID='+mediaID+'&belongType='+belongType,
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
