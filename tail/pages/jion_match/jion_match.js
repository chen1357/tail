// pages/jion_match/jion_match.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid:"",
  },
  view_list:function(){
    wx.navigateTo({
      url: '../match_list/match_list',
    })
  },
  uuid_tap:function(e){
    var app=getApp();
    console.log(typeof(e.detail.value))
    var s=e.detail.value
    app.globalData.uuid=e.detail.value;
    this.setData({
      uuid: s
    })
  },
  confirm:function(e){
    var that=this;
    var app=getApp();
    console.log(this.data.uuid+"!!!")
    var url_1='http://172.17.173.97:9000/api/game/'+that.data.uuid;
    wx.request({
          url: 'http://172.17.173.97:9000/api/game/'+ that.data.uuid,
          method: 'Post',//方法分GET和POST，根据需要写
          header: {//定死的格式，不用改，照敲就好
        "Authorization": "Bearer "+app.globalData.token
      },
      data:{
      },
      success: function (res) {//这里写调用接口成功之后所运行的函数
        console.log(res.data.msg)
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
            title: res.data.data.err_msg,
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
  return_home:function(){
    wx.reLaunch({
      url: '../mainpage/mainpage',
    });
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})