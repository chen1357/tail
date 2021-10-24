// pages/online/online.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    self:false
  },

  create_cancel() {
  this.setData({
    showDialog: !this.data.showDialog
  });

},
  create_game:function(){
    this.setData({
      showDialog: true
  })
 
  },
  self_jion:function(e){
    var that=this;
    var app=getApp();
    if(e.currentTarget.dataset.self=="true"){
      app.globalData.self_flag=true;
    }
    else{
      app.globalData.self_flag=false;
    }
    console.log(typeof(app.globalData.self_flag))
    this.setData({
      'self':app.globalData.self_flag
    })
    console.log(that.data.self)
    wx.request({
          url: 'http://172.17.173.97:9000/api/game',
          method: 'post',//方法
          header: {//格式
        "Authorization": "Bearer "+app.globalData.token
          },
          data:{
              "private": app.globalData.self_flag
          },
          success: function (res) {//调用接口成功之后
          var app=getApp();
            if(res.data.msg=="操作成功")
            {
              app.globalData.uuid=res.data.data.uuid;
              that.setData({
                showDialog: !that.data.showDialog
              });
              //console.log(that.data.self)
              if(that.data.self==true){
                setTimeout(function() {
                  wx.navigateTo({
                    url: '../self_online/self_online',
                  })
                });
              }
              else{
                setTimeout(function() {
                  wx.navigateTo({
                    url: '../online_match/online_match',
                  })
                });
              }
              
            }
            else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              });
            }
          console.log(res.data);//调出来的数据在控制台显示，方便查看
          },
          fail: function (res) {//调用接口失败之后
            wx.showToast({
              title: '创建失败',
              icon: 'none',
            });
            console.log('.........fail..........');
           }
        })
  },
  jion_game:function(){
    wx.navigateTo({
      url:'../jion_match/jion_match',
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
