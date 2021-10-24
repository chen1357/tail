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
      method: 'Post',//方法分GET和POST，根据需要写
      header: {//定死的格式，不用改，照敲就好
        'Content-Type': 'application/x-www-form-urlencoded' //json'
      },
      data:{
        student_id:"031902534",//that.data.ano,//
        password:"lucy031902",//that.data.pwd//
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
    fail: function (res) {//这里写调用接口失败之后所运行的函数
      wx.showToast({
        title: '登录失败',
        icon: 'none',
      });
      console.log('.........fail..........');
    }
    })
  }
  // bindKeyInput: function (e) {
  //   this.setData({
  //     inputValue: e.detail.value
  //   })
  // },
  // bindReplaceInput: function (e) {
  //   var value = e.detail.value
  //   var pos = e.detail.cursor
  //   var left
  //   if (pos !== -1) {
  //     // 光标在中间
  //     left = e.detail.value.slice(0, pos)
  //     // 计算光标的位置
  //     pos = left.replace(/11/g, '2').length
  //   }

  //   // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
  //   return {
  //     value: value.replace(/11/g, '2'),
  //     cursor: pos
  //   }

  //   // 或者直接返回字符串,光标在最后边
  //   // return value.replace(/11/g,'2'),
  // },
  // bindHideKeyboard: function (e) {
  //   if (e.detail.value === '123') {
  //     // 收起键盘
  //     wx.hideKeyboard()
  //   }
  // }
})