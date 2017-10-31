//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    reflashRun:false,
    loadingOver:false,
    IMG_URL:app.data.IMG_URL,//图片域名地址
    pageCount:0,//上拉加载分页器页数
    //轮播图参数
    indicatorDots: true,//轮播图指示点
    indicatorActiveColor: '#ffffff',//当前选中的指示点颜色
    autoplay: true,//轮播图自动播放
    interval: 3000,//轮播换图时间
    duration: 1000,//轮播滑动动画时长
    carousel: [],//轮播图
    purchase:[],//水平营销板块(已经废弃)
    funcList:[],//宫格营销模块
    flexInfo:[{"title":"热销商品"}],
    goodsInfo:[],  //商品信息
    pUpLoading:false,//上拉加载动画
    contentInfo:[
      {
        belongType:"5",
        commentNum:6,
        date:"09-05",
        image:"http://xcximage.dgcckj.com/upload/audioVideo/audioVideoImages/2017/09/03/092031.jpg",
        listenNum:9,
        mediaID:29,
        sender:"文章资讯",
        title:"孩子，我希望你长大，也害怕你长大"
      },
    ],//咨询/视频和音频列表
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
  loadIndex:function(){
    var that = this;
    var data = { orgID: app.globalData.ORG_ID,pageCount:0 };
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/home/getIndex.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        if (data.funcList.length<5){
          var funcListWidth = 100 / data.funcList.length;
          var justifyContent = "center";
        }else{
          var funcListWidth = 25;
          var justifyContent = "";
        }
        that.setData({
          carousel: data.carouseInfo,
          goodsInfo: data.goodsInfo,
          funcList: data.funcList,
          funcListWidth: funcListWidth,
          justifyContent: justifyContent,
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
      case 4:
        wx.navigateTo({
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
    var goodsInfo = that.data.goodsInfo;
    that.setData({
      pUpLoading: true,
    });
    that.data.pageCount ++;
    var data = {orgID: app.globalData.ORG_ID,pageCount:that.data.pageCount}
    var dataJson = JSON.stringify(data);
    wx.request({
      url: app.data.API_URL + '/cms/home/getIndex.action',
      data: { json: dataJson },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        console.log('data--->'+data);
        goodsInfo = goodsInfo.concat(data.goodsInfo);
        console.log('goodsInfo--->'+goodsInfo);
        setTimeout(function(){
          that.setData({
            goodsInfo: goodsInfo,
            pUpLoading: false,
          });
        }, 1000);
      }
    });
  },


})