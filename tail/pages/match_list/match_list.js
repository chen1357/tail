// pages/match_list/match_list.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
      uuid:'',
      games:[],
  },
  choose:function(e){
    var that = this;
    var app=getApp();
    // console.log("aaa")
    // console.log(typeof(app.globalData.uuid));
    // console.log(typeof(e.currentTarget.dataset.id));
    // console.log("bbb")
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/'+ e.currentTarget.dataset.id,
      method: 'Post',//方法分GET和POST，根据需要写
      header: {//定死的格式，不用改，照敲就好
    "Authorization": "Bearer "+app.globalData.token
  //       'Content-Type': 'application/x-www-form-urlencoded' //json'
      },
      data:{

           },
      success: function (res) {//这里写调用接口成功之后所运行的函数
        //console.log(res.data.message)
        if(res.data.msg=="操作成功")
        {
          wx.showToast({
          title:"加入成功",
          icon: 'none',
          duration: 800,
          success: function () {
            setTimeout(function() {
              wx.navigateTo({
                url: '../online_match/online_match',
              })
            }, 800);
                }
          });
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          });
        }
      console.log(res.data);//调出来的数据在控制台显示，方便查看
      },
      fail: function (res) {//这里写调用接口失败之后所运行的函数
        wx.showToast({
          title: '加入失败',
          icon: 'none',
        });
        console.log('.........fail..........');
       }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var app=getApp();
    var that=this;
    console.log(app.globalData.token)
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/index',
      method: 'GET',//方法分GET和POST，根据需要写
          header: {//定死的格式，不用改，照敲就好
        "Authorization": "Bearer "+app.globalData.token
      //       'Content-Type': 'application/x-www-form-urlencoded' //json'
          },
          data:{
            page_size:"300",
            page_num:"11"
          },
        success: function (res) {//这里写调用接口成功之后所运行的函数
            console.log(res.data)
            if(res.data.msg=="操作成功")
            {
              wx.showToast({
                title:"获取成功",
                icon: 'none',
                duration: 800,
              });
              that.setData({
                games: res.data.data.games
              })
            }
            else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              });
            }
              console.log(that.data.games);//调出来的数据在控制台显示，方便查看
        },
        fail: function (res) {//这里写调用接口失败之后所运行的函数
          wx.showToast({
            title: '获取失败',
            icon: 'none',
          });
          console.log('.........fail..........');
        }
    })
  },
})