Page({
  data: {
    focus: false,
    inputValue: '',
    ano:"",
    pwd:"",
    resdata:{},
    // succes:false,
    // fail:false,
  },
  return_home:function(){
    wx.reLaunch({
      url: '../mainpage/mainpage',
    });
  },
  ano_tap:function(e){
    this.setData({
      ano: e.detail.value
    })
  },
  pwd_tap:function(e){
    this.setData({
      pwd: e.detail.value
    })
  },
  confirm:function(){
    var that = this;
    wx.request({
      url: 'http://172.17.173.97:8080/api/user/login',
      method: 'Post',//方法
      header: {
        'Content-Type': 'application/x-www-form-urlencoded' //json'
      },
      data:{
        student_id:that.data.ano,//
        password:that.data.pwd//
         },
    success: function (res) {//这里写调用接口成功之后所运行的函数
        console.log(res.data.message)
        if(res.data.message=="Success")
        {
          var app = getApp()
          app.globalData.token = res.data.data.token
          wx.showToast({
            title:"登录成功",
            icon: 'none',
            duration: 800,
            success: function () {
              setTimeout(function() {
                wx.navigateTo({
                  url: '../online/online',
                })
              }, 800);
            }
          });
        }
        else{
          wx.showToast({
            title: res.data.data.error_msg,
            icon: 'none',
          });
        }
         console.log(res.data);//调出来的数据在控制台显示，方便查看
    },
    fail: function (res) {//调用接口失败之后
      wx.showToast({
        title: '登录失败',
        icon: 'none',
      });
      console.log('.........fail..........');
    }
    })
  }
  
})