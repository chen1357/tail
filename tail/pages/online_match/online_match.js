// pages/online_match/online_match.js
// request，先判断对局是否开始；1.未开始，等待不断请求接口；2.开始，判断是否是你的回合，是--->出牌  否--->则请求连接获取上步操作再开始自己的回合
  // pages/player_match/player_match.js
  var getable=true;
  let interval_ai = null;//全局变量
  let interval=null;
  function get_last(that){ /*获取上一步操作 */
    var app=getApp();
    if(that.data.turn==false){
        wx.request({
          url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid+'/last',
          method: 'get',//方法
          header: {//格式
          "Authorization": "Bearer "+app.globalData.token
        },
        data:{
        },
        success: function (res) {//这里写调用接口成功之后所运行的函数
          if(res.data.msg=="操作成功")
          {
          
              if(res.data.data.last_msg=="对局刚开始"){//刚开始
                if(that.data.isbegin==false){
                  wx.showToast({
                  title: '游戏开始',
                  icon: 'none',
                });
                getable=false;
                
              }
              if(res.data.data.your_turn==true){
                  clearInterval(interval);
                  that.check_ai();
                }
              that.setData({
                'isbegin':true,
                'turn':res.data.data.your_turn,
              });
              //console.log(typeof(res.data.data.your_turn)+res.data.data.your_turn)
              
              
            }
            else{//进行中
                    var s=res.data.data.last_code
                    var p=s.substring(0,1)//上一个玩家
                    var x=s.substring(2,3);//来源
                    var card=s.substring(4);;//牌
                    //console.log(card,x)
                    //console.log("tat"+that.data.turn)
                  if(that.data.turn==false&&app.globalData.online_player!=p&&res.data.data.last_code!=that.data.last_code){
                    if(x=="0")
                    { 
                          let place=that.data.place;
                          var arr=[];arr=arr.concat(card);
                          place=arr.concat(that.data.place)//抽取的牌放到放置区顶部
                          that.divide(card)//移动到放置区对应的花色分区
                          let len=that.data.group_length;
                          //console.log("len"+that.data.group_length)
                          len=len-1;
                          let len2=that.data.place_length;
                          len2=len2+1;
                          //console.log("yyy"+len)
                          that.setData({
                            'place':place,
                            'group_length':len,
                            'place_length':len2
                          }),
                          that.same_detec(card,false);
                            if(that.data.group_length==0)//即抽出了最后一张牌-------------跳转到游戏结束页面或者  有游戏结束哪个玩家赢了的弹窗出现，可以选择返回主页，或者 再来一局即（重新开启该页面）
                            {
                              //console.log("201")
                              //that.game_over();
                            }
                            that.setData({
                                'place_length':that.data.place.length
                              })
                              //回合结束，设置成非自己的回合，等待发送请求，获取请求结果，再次轮到自己的回合
                              
                      }
                      else{
                        if(card[0]=="S"){
                          let arr=that.data.hand_card4;
                          if(arr.length>0){
                            var top=arr[0];
                            arr.splice(0,1);//手牌出一张
                          let cards=that.data.place;//放置区多一张
                          cards=[top].concat(cards);
                          that.setData(
                          {
                            'hand_card4':arr,
                            'place':cards,
                            'hand_card_len[4]':arr.length ,/////////////////////
                            'place_length':cards.length////////////////////////
                          }),
                          that.divide(top);//花色分区
                          that.same_detec(top,false);
                          }  
                        }
                        else if(card[0]=="H"){
                          let arr=that.data.hand_card5;
                          if(arr.length>0){
                            var top=arr[0];
                            arr.splice(0,1);//手牌出一张
                          let cards=that.data.place;//放置区多一张
                          cards=[top].concat(cards);
                          that.setData(
                          {
                            'hand_card5':arr,
                            'place':cards,
                            'hand_card_len[5]':arr.length ,/////////////////////
                            'place_length':cards.length////////////////////////
                          }),
                          that.divide(top);//花色分区
                          that.same_detec(top,false);
                          }  
                        }
                        else if(card[0]=="C"){
                          let arr=that.data.hand_card6;
                          if(arr.length>0){
                            var top=arr[0];
                            arr.splice(0,1);//手牌出一张
                          let cards=that.data.place;//放置区多一张
                          cards=[top].concat(cards);
                          that.setData(
                          {
                            'hand_card6':arr,
                            'place':cards,
                            'hand_card_len[6]':arr.length ,/////////////////////
                            'place_length':cards.length////////////////////////
                          }),
                          that.divide(top);//花色分区
                          that.same_detec(top,false);
                          } 
                        }
                        else if(card[0]=="D"){
                          let arr=that.data.hand_card7;
                          if(arr.length>0){
                            var top=arr[0];
                            arr.splice(0,1);//手牌出一张
                          let cards=that.data.place;//放置区多一张
                          cards=[top].concat(cards);
                          that.setData(
                          {
                            'hand_card7':arr,
                            'place':cards,
                            'hand_card_len[7]':arr.length ,/////////////////////
                            'place_length':cards.length////////////////////////
                          }),
                          that.divide(top);//花色分区
                          that.same_detec(top,false);
                          } 
                        }
                      }
                      getable=false;
                      clearInterval(interval);
                      if(res.data.data.your_turn==true){
                          that.check_ai();
                        }
                  }
                    
                  
                        //clearInterval(a)
                        //console.log("mmmout") 
                        that.setData({
                          'isbegin':true,
                          'turn':res.data.data.your_turn
                        });
                        

                }
          }
          else if(res.data.data.err_msg=="对局已结束"){
              clearInterval(interval);
              that.game_over();
          }
          else{
              
              wx.showToast({
                title: res.data.data.err_msg,
                icon: 'none',
                duration:2100
              });
            
          }
          //console.log("111")
        console.log(res);//调出来的数据在控制台显示，方便查看
        },
        fail: function (res) {//这里写调用接口失败之后所运行的函数
          wx.showToast({
            title: '连接失败',
            icon: 'none',
          });
          console.log('.........fail..........');
         }
      })
    }
    
  // setTimeout(function () {
  //   //要延时执行的代码
  //  }, 1000)
  return function(){
    get_last(that)
  }
  }
  Page({
    data: {
      isbegin:false,//游戏是否开始   /////////////////新加的
      showDialog: false,            /////////////////新加的
      turn:false,//是否是玩家的回合 1为是  /////////////////新加的
      text_1:"托管",
      game_over_showDialog: false,
      player:"",
      last_code:"",
      result:"",//游戏结果
      isai:-1,//是否启动托管
      group:[],
      group_length:52,                 /////////////////新加的
      place:[], 
      place_length:0,
      S: [], H: [], C: [], D: [],  //  放置区   
      //interval_2:"",
      hand_card0:[],hand_card1:[],hand_card2:[],hand_card3:[],//手牌
      hand_card4:[],hand_card5:[],hand_card6:[],hand_card7:[],
      hand_card_len:[0,0,0,0,0,0,0,0],
      card:[[],[],[],[]],//黑桃红桃梅花方片///////////////////
     hand_card:[[],[],[],[],[],[],[],[]]/////////////////////
     
   },
    onLoad:function(options)//初始化牌局
    { 
      var app=getApp();
      var that=this;
      this.data.last_code="",
      this.data.player="",
      this.data.isbegin=false,
      this.data.showDialog=false,  
      this.data.game_over_showDialog=false,     
      this.data.turn=false,//是否是玩家的回合 1为是
      this.data.result="",//游戏结果
      this.data.isai=-1,
      this.data.group=[],this.data.group_length=52,

     this.data.place=[],this.data.place_length=0,
      this.data.S= [], this.data.H= [], this.data.C= [], this.data.D= [],  //  放置区

     this.data.hand_card0=[],this.data.hand_card1=[],this.data.hand_card2=[],this.data.hand_card3=[],//手牌
     this.data.hand_card4=[],this.data.hand_card5=[],this.data.hand_card6=[],this.data.hand_card7=[],
      this.data.hand_card_len=[0,0,0,0,0,0,0,0],
      this.data.hand_card=[[],[],[],[],[],[],[],[]],////////////////////
      this.data.card=[[],[],[],[]]//黑桃红桃梅花方片////////////////////
      // while(1){
      //   game_begin();
      // }
      //this.check_ai();
      var that=this
      clearInterval(interval);
      interval=setInterval(  
        get_last(that)
      ,1000)
    },
    check_ai:function(){
      console.log("check")
      var _this = this;  //定时调用该函数，用于判断是否处于托管
      interval_ai = setInterval( ()=> {
        if(this.data.isai==1&&this.data.turn==true)//当前回合有托管
        {
          //console.log("qqq")
          this.setData({
            'turn':false
          })
          clearInterval(interval);
            this.trusteeship();
        }
      },1000)
    },
    start_ai:function()//这个player是字符串 托管键会触发该函数，wxml触发函数传的参数
     { 
      //console.log('isai000:'+this.data.isai)
      this.setData({
        'isai': -(this.data.isai)
      })
      //console.log('isai:'+this.data.isai)
      if(this.data.isai==1){
        this.setData({
          'text_1':"托管中",
          // 'scoer_1': 'rgba(168, 144, 148,1)'
        })
      }
      else{
        this.setData({
          'text_1':"托管",
          // 'scoer_1':'rgba(255, 192, 203,1)'
        })
      }
     },
    group_out:function()//player=1 or -1 玩家几出了牌组中牌，
     { 
       console.log("groupout")
      var app=getApp();
      var that=this;
      //console.log("xxx"+this.data.group_length)
       if(this.data.isbegin==true && this.data.isai==-1 && this.data.turn==true)//游戏已经开始，且没有托管,且显示当前是玩家自己的回合，才会有出牌
       {    getable=false;
          clearInterval(interval);
          this.setData({
            'turn':false
          })
          
         //console.log(this.data.group_length)
         var flag=false;
            if(this.data.group_length>0)
            {    //console.log("mmm")
                  var a = setInterval(function () { 
                    //循环执行代码 
                    //console.log("zzz")
                    wx.request({
                      url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
                      method: 'put',//方法分GET和POST，根据需要写
                      header: {
                        "Authorization": "Bearer "+app.globalData.token
                      },
                      data:{
                          "type":0
                      },
                      success: function (res) {//这里写调用接口成功之后所运行的函数
                        console.log("group")
                        console.log(res)
                        if(res.data.msg== "操作成功"){
                          that.setData({
                            'last_code':res.data.data.last_code//翻出的结果
                          })
                          flag=true;
                          //console.log("lastcode"+that.data.last_code)
                        }
                      },
                      fail: function (res) {//这里写调用接口失败之后所运行的函数
                        console.log("group fail")
                        console.log(res)
                        wx.showToast({
                          title: '操作失败',
                          icon: 'none',
                        });
                        console.log('.........fail..........');
                       }
                    })
                    if(flag==true){
                  //console.log("1")
                  var s=that.data.last_code
                  var card=s.substring(4);//抽取的牌
                  //var t=s.split(" ")
                  //var card=t[2]
                  //console.log(card)
                  //var x=s.substring(2,3);
                  //console.log(card)
                  let place=that.data.place;
                  var arr=[];arr=arr.concat(card);
                  place=arr.concat(that.data.place)//抽取的牌放到放置区顶部
                  that.divide(card)//移动到放置区对应的花色分区
                  let len=that.data.group_length;
                  len=len-1;
                  let len2=that.data.place_length;
                  len2=len2+1;
                  that.setData({
                    'place':place,
                    'group_length':len,
                    'place_length':len2
                  }),
                  that.same_detec(card,true);
                    if(that.data.group_length==0)//即抽出了最后一张牌-------------跳转到游戏结束页面或者  有游戏结束哪个玩家赢了的弹窗出现，可以选择返回主页，或者 再来一局即（重新开启该页面）
                    {
                      //that.game_over();
                    }
                    that.setData({
                        'place_length':that.data.place.length
                      })
                      //回合结束，设置成非自己的回合，等待发送请求，获取请求结果，再次轮到自己的回合
                      that.setData({
                        'turn':false
                      })
                        clearInterval(a)
                        getable=true;
                        clearInterval(interval);
                        interval=setInterval(  
                          get_last(that)
                        ,1000)
                        console.log("out") 
                }
                else{
                    //this.game_over();
                }
                  }, 1000)
                
             
              //while(flag){
                
             // }
             /* 操作成功 看自己拿的哪张牌*/
             
             }
              
      }
    },
     //手牌出牌
    card_out:function(e)//手牌有8个组，点击的时候会传送是第几个手牌组的传参，并且传送出这是玩家几
    {     console.log("card_out")
    if(this.data.isbegin==true && this.data.isai==-1 && this.data.turn==true)//游戏已经开始，且没有托管,且显示当前是玩家自己的回合，才会有出牌
    { 
      this.setData({
        'turn':false
      })
      clearInterval(interval);  
      var cd="";
        if(e.currentTarget.dataset.operation==0) {//用户选择card0手牌出牌
            let arr=this.data.hand_card0;
          if(arr.length>0)
          { var s=arr[0];
            cd=s;
            arr.splice(0,1);//手牌出一张
            let card=this.data.place;//手牌被移动到放置区的顶部
            card=[s].concat(card);
            this.setData(
            {
              'hand_card0':arr,
              'place':card,
              'hand_card_len[0]':arr.length ,/////////////////////
              'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s,true);
          }
          }
          else if(e.currentTarget.dataset.operation==1) {
            let arr=this.data.hand_card1;
            if(arr.length>0){
              var s=arr[0];
              cd=s;
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card1':arr,
              'place':card,
              'hand_card_len[1]':arr.length ,/////////////////////
              'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s,true);
            }
          }
          else if(e.currentTarget.dataset.operation==2) {
            let arr=this.data.hand_card2;
            if(arr.length>0){
              var s=arr[0];
              cd=s;
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card2':arr,
              'place':card,
              'hand_card_len[2]':arr.length ,/////////////////////
              'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s,true);
            }
          }
          else if(e.currentTarget.dataset.operation==3){
            let arr=this.data.hand_card3;
            if(arr.length>0){
              var s=arr[0];
              cd=s;
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card3':arr,
              'place':card,
              'hand_card_len[3]':arr.length ,/////////////////////
              'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s,true);
            }
          }
          this.setData({
            'turn':false
          })
          /* 连接接口传操作 */
          this.perform_operation(cd);

          
    }  
    },
    //一致检测
    same_detec:function(x,inplayer)
     {  console.log("same_detec")
     
       if(this.data.place.length>1 && this.data.place[1][0]==x[0])
       {
         this.card_in(inplayer);  
       }
    },
    divide:function(x)//在放置区里面将牌按花色分类
    {    console.log("divide")  
      if(x[0]=='S')
      { 
       this.setData({
        'S':this.data.S.concat(x)
      })
      }
      else if(x[0]=='H')
      { 
       this.setData({
        'H':this.data.H.concat(x)
       })
      }
      else if(x[0]=='C')
      { this.setData({
        'C':this.data.C.concat(x)
       })
      }
      else
      { this.setData({
        'D':this.data.D.concat(x)
       })
      }
    },
    //收牌：从放置区收入手牌
    card_in:function(inplayer){
       console.log("card_in")
    if(inplayer==true)
    {
        this.setData({
            'hand_card0':this.data.hand_card0.concat(this.data.S),
            'hand_card1':this.data.hand_card1.concat(this.data.H),
            'hand_card2':this.data.hand_card2.concat(this.data.C),
            'hand_card3':this.data.hand_card3.concat(this.data.D),
            'hand_card_len[0]':this.data.hand_card0.concat(this.data.S).length,
            'hand_card_len[1]':this.data.hand_card1.concat(this.data.H).length,
            'hand_card_len[2]':this.data.hand_card2.concat(this.data.C).length,
            'hand_card_len[3]':this.data.hand_card3.concat(this.data.D).length,
            'place':[],
            'place_length':0,
            'S':[],'H':[],'C':[],'D':[]
          })
    }
      else
      {
        this.setData({
            'hand_card4':this.data.hand_card4.concat(this.data.S),
            'hand_card5':this.data.hand_card5.concat(this.data.H),
            'hand_card6':this.data.hand_card6.concat(this.data.C),
            'hand_card7':this.data.hand_card7.concat(this.data.D),
            'hand_card_len[4]':this.data.hand_card4.concat(this.data.S).length,
            'hand_card_len[5]':this.data.hand_card5.concat(this.data.H).length,
            'hand_card_len[6]':this.data.hand_card6.concat(this.data.C).length,
            'hand_card_len[7]':this.data.hand_card7.concat(this.data.D).length,
            'place':[],
            'place_length':0,
            'S':[],'H':[],'C':[],'D':[]
          })
      }



        // for (var i = 0; i < this.data.length; i++) {
        //   this.setData({
        //     ["hand_card[" + i + "]"]: this.data.hand_card[" + i + "].concat(this.data.card[i]), 
        //   })
        // }
    //   for (var i = 0; i < 4; i++) {
    //     this.data.card[i].splice(0,this.data.card[i].length)
    //     this.setData({
    //       ["card_len[" + i + "]"]: this.data.card[i], 
    //     })
    //   }
    //   this.data.place.splice(0,this.data.place.length);
    //   this.setData({
    //     'place_length':this.data.place.length
    //   })
    //   for (var i = 0; i < 4; i++) {
    //     this.setData({
    //       ["card_len[" + i + "]"]: this.data.card[i], 
    //     })
    //   }
      // this.setData({
      //   'hand_card0':this.data.hand_card0.concat(this.data.S),
      //   'hand_card1':this.data.hand_card1.concat(this.data.H),
      //   'hand_card2':this.data.hand_card2.concat(this.data.C),
      //   'hand_card3':this.data.hand_card3.concat(this.data.D),
      // })
    },
   //托管出牌
    ai_out:function(x)
    {
        var cd="";
        this.setData({
          'turn':false
        })
        clearInterval(interval);
        if(x==0)
        {  let arr =this.data.hand_card0;
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card0':arr,
                'hand_card_len[0]':arr.length,
                'place':place,
                'place_length':place.length,
            })
        }
        else if(x==1)
        {
            let arr =this.data.hand_card1;
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card1':arr,
                'hand_card_len[1]':arr.length,
                'place':place,
                'place_length':place.length,
            })
        }
        else if(x==2)
        {
            let arr =this.data.hand_card2;
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card2':arr,
                'hand_card_len[2]':arr.length,
                'place':place,
                'place_length':place.length,
            })
        }
        else if(x==3)
        {
            let arr =this.data.hand_card3;
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card3':arr,
                'hand_card_len[3]':arr.length,
                'place':place,
                'place_length':place.length,
            })
        }
        this.divide(cd)//移动到放置区对应的花色分区
        this.same_detec(cd,true);
        this.setData({
          'turn':false
        })
        /*连接接口*/
        this.perform_operation(cd);
    },
    ai_group_out:function(){
      clearInterval(interval);
      this.setData({
        'turn':false
      })
      var that=this;
      var app=getApp();   
       var flag=false;
        var a = setInterval(function () { 
            wx.request({
              url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
              method: 'put',//方法分GET和POST，根据需要写
              header: {
                "Authorization": "Bearer "+app.globalData.token
              },
              data:{
                  "type":0
              },
              success: function (res) {//这里写调用接口成功之后所运行的函数
                if(res.data.msg== "操作成功"){
                  that.setData({
                    'last_code':res.data.data.last_code//翻出的结果
                  })
                  flag=true;
                }
              },
              fail: function (res) {//这里写调用接口失败之后所运行的函数
                wx.showToast({
                  title: '操作失败',
                  icon: 'none',
                });
                console.log('.........fail..........');
               }
            })
            if(flag==true){
              clearInterval(a)
              getable=true;
              /* 操作成功 看自己拿的哪张牌*/
              var card=that.data.last_code.substring(4);//抽取的牌
              let place=that.data.place;
              var arr=[];arr=arr.concat(card);
              place=arr.concat(that.data.place)//抽取的牌放到放置区顶部
              that.divide(card)//移动到放置区对应的花色分区
              let len=that.data.group_length;
              len=len-1;
              let len2=that.data.place_length;
              len2=len2+1;
              that.setData({
                'place':place,
                'group_length':len,
                'place_length':len2
              }),
              that.same_detec(card,true);
              if(that.data.group_length==0)//即抽出了最后一张牌-------------跳转到游戏结束页面或者  有游戏结束哪个玩家赢了的弹窗出现，可以选择返回主页，或者 再来一局即（重新开启该页面）
              {
                //console.log("590")
                //that.game_over();
              }
                that.setData({
                  'place_length':that.data.place.length
                })
                //回合结束，设置成非自己的回合，等待发送请求，获取请求结果，再次轮到自己的回合
                that.setData({
                  'turn':false
                })
              clearInterval(interval);
              interval=setInterval(  
                get_last(that)
              ,1000)
              console.log("out") 
            }

          }, 1000)
      // clearInterval(interval);
      // interval=setInterval(  
      //   get_last(that)
      // ,500)
    },
    trusteeship:function() //托管的时候，其他按键都不能使用
    { 
      console.log("trusteeship")
       clearInterval(interval_ai);
       var place_empty=true;
       if(this.data.place_length>0){
         var place0= this.data.place[0];
       }
       
             if(this.data.hand_card0.length> 0&& (place_empty||(!place_empty&&place0.substring(0,1)!='S')))
             {
               this.ai_out(0);
             }
             else if(this.data.hand_card1.length>0&&(place_empty||(!place_empty&&place0.substring(0,1)!='H')))
             {
                this.ai_out(1);
             }
             else if(this.data.hand_card2.length>0&&(place_empty||(!place_empty&&place0.substring(0,1)!='C')))
             {
                this.ai_out(2);
             }
             else if(this.data.hand_card3.length>0&&(place_empty||(!place_empty&&place0.substring(0,1)!='D')))
             {
                this.ai_out(3);
             }
             else
             {
               this.ai_group_out();
             }
            //  this.check_ai();
     },
     game_over:function()
    { console.log("game_over")  
      var app=getApp();
      var that=this;
      wx.request({
        url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
        method: 'get',//方法
        header: {//格式
        "Authorization": "Bearer "+app.globalData.token
        },
        data:{
        },
        success:function(res){
          console.log(res)
            if(res.data.msg=="操作成功"){
              if(res.data.data.winner==1){
                if(app.globalData.online_player=="1P"){
                  that.setData({
                      'result':"恭喜获胜"
                  })
                }
                else{
                  that.setData({
                    'result':"遗憾失败"
                })
                }
                  
              }
              else if(res.data.data.winner==2){
                if(app.globalData.online_player=="2P"){
                  that.setData({
                      'result':"恭喜获胜"
                  })
                }
                else{
                  that.setData({
                    'result':"遗憾失败"
                })
                }
                  
              }
              else{
                that.setData({
                  'result':"平局"
              })
              }
              
            }
        },
        fail:function(res){

        }
      })
      this.setData({
        'game_over_showDialog':true
      })
      // var num1=0;var num2=0;
      //    num1=num1+this.data.hand_card0.length+this.data.hand_card1.length+this.data.hand_card2.length+this.data.hand_card3.length;
      //   num2=num2+this.data.hand_card4.length+this.data.hand_card5.length+this.data.hand_card6.length+this.data.hand_card7.length;
      // if(num1<num2)
      // {
      //    this.setData({result:"玩家1胜利"})
      // }
      // else if (num1==num2){
      //   this.setData({result:"平局啦"})
      // }
      // else{
      //   this.setData({result:"玩家2胜利"})
      // }
    },
    move:function(){
        console.log("move")
        var animation = wx.createAnimation({
          duration: 4000,// 动画持续多少毫秒
          timingFunction: 'ease',//运动”的方式，例子中的 'ease'代表动画以低速开始，然后加快，在结束前变慢
          delay: 1000//多久后动画开始运行
        });
        animation.opacity(0.2).translate(100, -100).step()
        this.setData({
          ani:  animation.export()
        })
      },
    game_begin:function()//按下游戏开始键触发该函数，初始化牌组里的牌，或是显示该页面时就调用该函数
    {  

    },
    perform_operation:function(cd){/*执行玩家操作 */
      console.log("perform")
      getable=false;
      var that=this;
      var flag=false;
      var app=getApp();
      var b = setInterval(function () { 
          {
            console.log("ffflag")
            wx.request({
              url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
              method: 'put',//方法分GET和POST，根据需要写
              header: {
                "Authorization": "Bearer "+app.globalData.token
              },
              data:{
                "type":1,
                "card":cd
              },
              success: function (res) {//这里写调用接口成功之后所运行的函数
                  console.log("perform")
                  console.log(res)
                if(res.data.msg== "操作成功"){
                  console.log("chenggong")
                  that.setData({
                    'last_code':res.data.data.last_code//翻出的结果
                  })
                  flag=true;
                }
                else if(res.data.data.err_msg=="对局已结束"){
                  clearInterval(interval);
                  that.game_over();
              }
                else{
                    console.log("shibai")
                }
              },
              fail: function (res) {//这里写调用接口失败之后所运行的函数
                wx.showToast({
                  title: '操作失败',
                  icon: 'none',
                });
                console.log('.........fail..........');
               }
            })
          }
          if(flag==true){
            clearInterval(b)
            getable=true;
            clearInterval(interval);
            interval=setInterval(  
              get_last(that)
            ,1000)
          }
    }, 1000)


    },
    onHide: function () {
      
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      clearInterval(interval)
      console.log("unload")
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
  })
  
  
   