// pages/self_online/self_online.js
// pages/online_match/online_match.js

function game_begin(that){
  var app=getApp();
  console.log("x")
  wx.request({
    url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid+'/last',
    method: 'get',//方法
    header: {//格式
    "Authorization": "Bearer "+app.globalData.token
  },
  data:{
  },
  success: function (res) {//调用接口成功之后
    console.log(res.data)
    if(res.data.msg=="操作成功")
    {
      if(res.data.data.last_msg=="对局刚开始"){//刚开始
        that.setData({
          'isbegin':true,
          'turn':res.data.data.your_turn
        });
        wx.showToast({
          title: '游戏开始',
          icon: 'none',
        });
        clearInterval(that.data.interval);
      }
      else{//进行中
        that.setData({
          'turn':res.data.data.your_turn,
          'last_code':res.data.data.last_code
        });
      }
    }
    else{
      wx.showToast({
        title: res.data.data.err_msg,
        icon: 'none',
      });
    }
  console.log(res.data);//调出来的数据在控制台显示，方便查看
  },
  fail: function (res) {//调用接口失败之后
    wx.showToast({
      title: '连接失败',
      icon: 'none',
    });
    console.log('.........fail..........');
   }
})
return function(){
  game_begin(that)
}
}

Page({

  data: {
    last_code:"",
    interval:"",
    isbegin:false,//游戏是否开始   /////////////////新加的
      showDialog: false,            /////////////////新加的
      turn:1,//是否是玩家的回合 1为是P1 2为P2  改变成为整数，不再是字符串  /////////////////、、、、、、、、、、、、、wxml传参渲染要改
      result:"",//游戏结果
      score_1:'rgba(255, 192, 203,1)',
      score_2:'rgba(255, 192, 203,1)',
      text_1:"托管",
      text_2:"托管",
      isai:[0,-1,-1],//isai[0] :托管是开，关 1开-1关 isai[1]:玩家1是否托管 isai[2]:玩家2是否托管//////////、、、、、、、、

        group:["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","SJ","SQ","SK",//牌库
                "H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","HJ","HQ","HK",
                "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","CJ","CQ","CK",
                "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","DJ","DQ","DK"],
      group_length:52,                 /////////////////新加的
      place:[], 
      place_length:0,

      hand_card_len:[0,0,0,0,0,0,0,0],

      card:[[],[],[],[]],//黑桃红桃梅花方片///////////////////
     hand_card:[[],[],[],[],[],[],[],[]]/////////////////////

  },
  onLoad: function (options) {
    var app=getApp();
    var that=this; 
    this.self_join();/*加入自己对局 */
    this.data.interval=setInterval(  
      game_begin(that)
    , 1000);
    this.data.last_code="",
    this.data.interval="",
    this.isbegin=false,
    this.showDialog=false,       
    this.data.turn=1,//是否是玩家的回合 1为是
    this.data.result="",//游戏结果
    
    this.data.isai=[0,-1,-1],//托管是关闭的,isai[x]:玩家x是否开启 1 开 -1 闭
    this.data.group=["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","SJ","SQ","SK",//牌库
             "H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","HJ","HQ","HK",
             "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","CJ","CQ","CK",
             "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","DJ","DQ","DK"],
    this.data.group_length=52,

   this.data.place=[],this.data.place_length=0,
    this.data.S= [], this.data.H= [], this.data.C= [], this.data.D= [],  //  放置区

   this.data.hand_card0=[],this.data.hand_card1=[],this.data.hand_card2=[],this.data.hand_card3=[],//手牌
   this.data.hand_card4=[],this.data.hand_card5=[],this.data.hand_card6=[],this.data.hand_card7=[],
  this.data.hand_card_len=[0,0,0,0,0,0,0,0],

  this.data.hand_card=[[],[],[],[],[],[],[],[]],////////////////////
  this.data.card=[[],[],[],[]]//黑桃红桃梅花方片////////////////////
  this.check_ai();
    
  },
  return_cancel() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  
  },
  return_confirm() {
    wx.reLaunch({
      url: '../mainpage/mainpage',
    });
  
  },
    
  return_home:function(){
      this.setData({
        showDialog: true
    })
  },

  /*加入自己的对局 */
  self_join:function(){
    var app=getApp();
    wx.request({
          url: 'http://172.17.173.97:9000/api/game/'+ app.globalData.uuid,
          method: 'Post',//方法分GET和POST，根据需要写
          header: {//定死的格式，不用改，照敲就好
        "Authorization": "Bearer "+app.globalData.token
      //       'Content-Type': 'application/x-www-form-urlencoded' //json'
          },
      data:{
      },
      success: function (res_1) {//这里写调用接口成功之后所运行的函数
      console.log(res_1)
        if(res_1.data.msg=="操作成功")
        {
          wx.showToast({
            title: "创建并加入自己对局成功",
            icon: 'none',
            duration: 1000,
          });
        }
        else{
          console.log(res_1.data)
          wx.showToast({
            title: res_1.data.data.error_msg,
            icon: 'none',
            duration: 800,
          });
          console.log("000");//调出来的数据在控制台显示，方便查看
        }
      
      },
      fail: function (res) {//这里写调用接口失败之后所运行的函数
        wx.showToast({
          title: '加入自己对局失败',
          icon: 'none',
        });
        console.log('.........fail..........');
       }
    })
  },
  get_last:function(){/*获取上一步操作 */
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid+'/last',
      method: 'get',//方法
      header: {//格式
      "Authorization": "Bearer "+app.globalData.token
    },
    data:{
    },
    success: function (res) {//调用接口成功之后
      console.log(res.data.msg)
      if(res.data.msg=="操作成功")
      {
        if(res.data.data.last_msg=="对局刚开始"){//刚开始
          that.setData({
            'isbegin':true,
            'turn':res.data.data.your_turn
          });
          wx.showToast({
            title: '游戏开始',
            icon: 'none',
          });
        }
        else{//进行中
          that.setData({
            'last_code':res.data.data.last_code
          });
        }
      }
      else{
        wx.showToast({
          title: "获取上一步操作失败",
          icon: 'none',
        });
      }
    console.log(res.data);//调出来的数据在控制台显示，方便查看
    },
    fail: function (res) {//调用接口失败之后
      wx.showToast({
        title: '连接失败',
        icon: 'none',
      });
      console.log('.........fail..........');
     }
  })
  },
  perform_operation:function(cd){/*执行玩家手牌4操作 */
    var flag=true;
      while(flag)
      {
        wx.request({
          url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
          method: 'put',//方法
          header: {
            "Authorization": "Bearer "+app.globalData.token
          },
          data:{
            "type":1,
            "card":cd
          },
          success: function (res) {//调用接口成功之后
            if(res.data.msg== "操作成功"){
              that.setData({
                'last_code':res.data.data.last_code//翻出的结果
              })
              flag=false;
            }
          },
          fail: function (res) {//调用接口失败之后
            wx.showToast({
              title: '操作失败',
              icon: 'none',
            });
            console.log('.........fail..........');
           }
        })
      }
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.interval)
  },

  
})