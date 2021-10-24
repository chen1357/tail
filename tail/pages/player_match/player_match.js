  // pages/player_match/player_match.js
  let interval = null;//全局变量
  Page({
    
    data: {
      isbegin:false,//游戏是否开始   /////////////////新加的
      showDialog: false,            /////////////////新加的
      game_over_showDialog: false,
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
      // S: [], H: [], C: [], D: [],  //  放置区   

      // hand_card0:[],hand_card1:[],hand_card2:[],hand_card3:[],//手牌
      // hand_card4:[],hand_card5:[],hand_card6:[],hand_card7:[],
      hand_card_len:[0,0,0,0,0,0,0,0],

      card:[[],[],[],[]],//黑桃红桃梅花方片///////////////////
     hand_card:[[],[],[],[],[],[],[],[]]/////////////////////
   },
   onLoad:function(options)//初始化牌局
    { this.isbegin=false,
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
    check_ai:function(){
      console.log("check")
      var _this = this;  //定时调用该函数，用于判断是否处于托管
      interval = setInterval( ()=> {
        console.log("xxxx")
        if(this.data.isai[this.data.turn]==1)//当前回合有托管
        {
          console.log("qqq")
            this.trusteeship();
        }
      },300)
    },
    start_ai:function(e)//这个player是字符串 托管键会触发该函数，wxml触发函数传的参数
     { 
       var player=e.currentTarget.dataset.player;
       console.log('player:'+player)
      if(player=="1") {
        console.log('isai[1]000:'+this.data.isai[1])
        this.setData({
          'isai[1]': -(this.data.isai[1])
        })
        console.log('isai[1]:'+this.data.isai[1])
        if(this.data.isai[1]==1){
          this.setData({
            'text_1':"托管中",
            'scoer_1': 'rgba(168, 144, 148,1)'
          })
        }
        else{
          this.setData({
            'text_1':"托管",
            'scoer_1':'rgba(255, 192, 203,1)'
          })
        }
      }
      else {
        this.setData({
          'isai[2]':-(this.data.isai[2])
        })
        console.log('isai[2]:'+this.data.isai[2])
        if(this.data.isai[2]==1){
          this.setData({
            'text_2':"托管中",
            'scoer_2': 'rgba(168, 144, 148,1)'
          })
        }
        else{
          this.setData({
            'text_2':"托管",
            'scoer_2':'rgba(255, 192, 203,1)'
          })
        }
      }
     },
     ai_card_out:function(x)
    {
      console.log("ai_card_out")
        var cd="";
        if(x==0)
        {  let arr =this.data.hand_card[0];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[0]':arr,
                'hand_card_len[0]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==1)
        {
            let arr =this.data.hand_card[1];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[1]':arr,
                'hand_card_len[1]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==2)
        {
            let arr =this.data.hand_card[2];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[2]':arr,
                'hand_card_len[2]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==3)
        {
            let arr =this.data.hand_card[3];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[3]':arr,
                'hand_card_len[3]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==4)
        {
            let arr =this.data.hand_card[4];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[4]':arr,
                'hand_card_len[4]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==5)
        {
            let arr =this.data.hand_card[5];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[5]':arr,
                'hand_card_len[5]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==6)
        {
            let arr =this.data.hand_card[6];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[6]':arr,
                'hand_card_len[6]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        else if(x==7)
        {
            let arr =this.data.hand_card[7];
            var s=arr[0];
            cd=s;
            arr.splice(0,1);
            let place=this.data.place;
            place=[s].concat(place);
            this.setData({
                'hand_card[7]':arr,
                'hand_card_len[7]':arr.length,
                'place':place,
                'place_length':place.length,
            })
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
        }
        if(this.data.turn==1){//切换玩家
          this.setData({
            'turn':2
          })
        }
        else{
          this.setData({
            'turn':1
          })
        }
        /*连接接口*/
        // perform_operation(cd);
    },
     trusteeship:function() //托管的时候，其他按键都不能使用
    {   if(this.data.turn==1)
        {  console.log("trtr")
            var out_flag=false;
            for (var i = 0; i < 4; i++) {
              if((this.data.hand_card_len[i]>0)){
                console.log("len:"+this.data.hand_card_len[i]+"i:"+i)
                this.ai_card_out(i);
                out_flag=true;
                break;
              }
            }
            if(out_flag==false){
              console.log("122")
              this.ai_group_out();
            }
        }
        else{
          console.log("zmzmz")
          var out_flag=false;
          for (var i = 4; i < 8; i++) {
              if((this.data.hand_card_len[i]>0)){
                this.ai_card_out(i);
                out_flag=true;
                break;
              }
          }
          if(out_flag==false){
            console.log("333")
            this.ai_group_out();
           }
      }

    },
    onHide: function () {
      // 页面关闭时，清空定时器函数
        clearInterval(interval);
      },
      onUnload: function () {
      // 页面关闭时，清空定时器函数
        clearInterval(interval);
      },
    group_out:function()//player=1 or -1 玩家几出了牌组中牌，
     { console.log("group_out")
       if(this.data.isai[this.data.turn]==-1)//没有托管
       {
        var len=this.data.group.length
        if(len>0)
        {   
          var random = Math.floor(Math.random() * len);//牌组中随便抽出一张牌
          var x=this.data.group[random];//抽出的牌
          let group=this.data.group;
          group.splice(random,1);//牌组中删除这张牌   ------有个动画移动牌的
          let place=this.data.place;
          var arr=[];arr=arr.concat(x);
          place=arr.concat(this.data.place)//放到放置区顶部
          this.setData({
            'place':place,
            'group':group,
            'place_length':place.length,/////////////
            'group_length':group.length
          }), 
          this.divide(x)//移动到放置区对应的花色分区
          this.same_detec(x);
          if(this.data.group.length==0)//即抽出了最后一张牌-------------跳转到游戏结束页面或者  有游戏结束哪个玩家赢了的弹窗出现，可以选择返回主页，或者 再来一局即（重新开启该页面）
          {
            this.game_over();
          }
          this.setData({
            'place_length':this.data.place.length
          })
          //回合转换
              if(this.data.turn==1){
                this.setData({
                  'turn':2
                })
                }
            else{
              this.setData({
                'turn':1
              })
            }
        }
       }
      
       
     },
     //手牌出牌
     ai_group_out:function(){
      //玩家启动托管，托管经过算法分析，决定拿去牌库里的牌
        var len=this.data.group.length
        if(len>0)
        {   
          var random = Math.floor(Math.random() * len);//牌组中随便抽出一张牌
          var x=this.data.group[random];//抽出的牌
          let group=this.data.group;
          group.splice(random,1);//牌组中删除这张牌
          let place=this.data.place;
          var arr=[];arr=arr.concat(x);
          place=arr.concat(this.data.place)//放到放置区顶部
          this.setData({
            'place':place,
            'group':group,
            'place_length':place.length,/////////////
            'group_length':group.length
          }), 
          this.divide(x)//移动到放置区对应的花色分区
          this.same_detec(x);
          if(this.data.group.length==0)//即抽出了最后一张牌-------------跳转到游戏结束页面或者  有游戏结束哪个玩家赢了的弹窗出现，可以选择返回主页，或者 再来一局即（重新开启该页面）
          {
            this.game_over();
          }
          this.setData({
            'place_length':this.data.place.length
          })
          if(this.data.turn==1){//切换玩家
            this.setData({
              'turn':2
            })
          }
          else{
            this.setData({
              'turn':1
            })
          }
        }
        
     },
    card_out:function(e)//手牌有8个组，点击的时候会传送是第几个手牌组的传参，并且传送出这是玩家几
    { 
      console.log("card_out");
      if(this.data.isai[this.data.turn]==-1)
      {    console.log(333,e.currentTarget.dataset.player,this.data.turn);
           if(this.data.turn==1)  var turn="1";
           else var turn ="2";
        if(e.currentTarget.dataset.player==turn)
        {   

          if(e.currentTarget.dataset.operation==0) {//用户选择card0手牌出牌
            let arr=this.data.hand_card[0];
            if(arr.length>0)
          { var s=arr[0];
            arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[0]':arr,
              'hand_card_len[0]':arr.length ,/////////////////////
              'place':card,
              'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区////////////////////////
            this.same_detec(s);
          }
          }
          else if(e.currentTarget.dataset.operation==1) {
            let arr=this.data.hand_card[1];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[1]':arr,
              'place':card,
              'hand_card_len[1]':arr.length ,/////////////////////
                'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            }
          }
          else if(e.currentTarget.dataset.operation==2) {
            let arr=this.data.hand_card[2];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[2]':arr,
              'place':card,
              'hand_card_len[2]':arr.length ,/////////////////////
          'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            }
          }
          else if(e.currentTarget.dataset.operation==3){
            let arr=this.data.hand_card[3];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[3]':arr,
              'place':card,
              'hand_card_len[3]':arr.length ,/////////////////////
          'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            }
          }
          else if(e.currentTarget.dataset.operation==4){
            let arr=this.data.hand_card[4];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              ['hand_card[4]']:arr,
              //'hand_card4':arr,
              'place':card,
              'hand_card_len[4]':arr.length ,/////////////////////
          'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            }  
          }
          else if(e.currentTarget.dataset.operation==5){
            let arr=this.data.hand_card[5];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[5]':arr,
              'place':card,
              'hand_card_len[5]':arr.length ,/////////////////////
          'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            }  
          }
          else if(e.currentTarget.dataset.operation==6){
            let arr=this.data.hand_card[6];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[6]':arr,
              'place':card,
              'hand_card_len[6]':arr.length ,/////////////////////
          'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            } 
          }
          else if(e.currentTarget.dataset.operation==7){
            let arr=this.data.hand_card[7];
            if(arr.length>0){
              var s=arr[0];
              arr.splice(0,1);//手牌出一张
            let card=this.data.place;//放置区多一张
            card=[s].concat(card);
            this.setData(
            {
              'hand_card[7]':arr,
              'place':card,
              'hand_card_len[7]':arr.length ,/////////////////////
          'place_length':card.length////////////////////////
            }),
            this.divide(s);//花色分区
            this.same_detec(s);
            } 
          }
          if(this.data.turn==1){//切换玩家
            this.setData({
              'turn':2
            })
          }
          else{
            this.setData({
              'turn':1
            })
          }
        }
      }
    },
    //一致检测
    same_detec:function(x)
    {  console.log("same_detec")
       if(this.data.place.length>1 && this.data.place[1][0]==x[0])
       {
         this.card_in();  
       }
    },
    //收牌：从放置区收入手牌
    card_in:function()
    { console.log("card_in")
      if(this.data.turn==1)
      {   
        for (var i = 0; i < 4; i++) {
          this.setData({
            ["hand_card[" + i + "]"]: this.data.hand_card[i].concat(this.data.card[i]), 
           // ["hand_card_len[" + i + "]"]: this.data.hand_card[i].length, 
          })
        }
      }
      else{
        for (var i = 4; i < 8; i++) {
          this.setData({
            ["hand_card[" + i + "]"]: this.data.hand_card[i].concat(this.data.card[i-4]), 
          })
        }
      }
      for (var i = 0; i < 4; i++) {
        this.data.card[i].splice(0,this.data.card[i].length)
        this.setData({
          ["card[" + i + "]"]: []//this.data.card[i],
        })
      }
      for (var i = 0; i < 4; i++) {
        this.setData({
          ["card_len[" + i + "]"]: 0//this.data.card[i].length, 
        })
      }
      for (var i = 0; i < 8; i++) {
        this.setData({
          ["hand_card_len[" + i + "]"]: this.data.hand_card[i].length, 
        })
      }
      this.data.place=[];
      this.setData({
        'place_length':0,
        'place':[],  
      })

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
    game_over:function()
    { console.log("game_over")  
      clearInterval(interval);
      var num1=0;var num2=0;
      num1=num1+this.data.hand_card[0].length+this.data.hand_card[1].length+this.data.hand_card[2].length+this.data.hand_card[3].length;
        // num1=num1+this.data.hand_card0.length+this.data.hand_card1.length+this.data.hand_card2.length+this.data.hand_card3.length;
        num2=num2+this.data.hand_card[4].length+this.data.hand_card[5].length+this.data.hand_card[6].length+this.data.hand_card[7].length;
        // num2=num2+this.data.hand_card4.length+this.data.hand_card5.length+this.data.hand_card6.length+this.data.hand_card7.length;
      if(num1<num2)
      {
         this.setData({result:"玩家1胜利"})
      }
      else if (num1==num2){
        this.setData({result:"平局啦"})
      }
      else{
        this.setData({result:"玩家2胜利"})
      }
      this.setData({
        game_over_showDialog: true
    })
    },
    divide:function(x)//在放置区里面将牌按花色分类
    { 
      console.log("divide")  
      console.log(x)
      // for (var i = 0; i < 4; i++) {
      //   this.setData({
      //     ["card_len[" + i + "]"]: this.data.card[i], 
      //   })
      // }
      if(x[0]=='S')
      { 
       this.setData({
        ["card[0]"]: this.data.card[0].concat(x)
        //'S':this.data.S.concat(x)
      })
      }
      else if(x[0]=='H')
      { 
       this.setData({
        ["card[1]"]: this.data.card[1].concat(x)
        //'H':this.data.H.concat(x)
       })
      }
      else if(x[0]=='C')
      { this.setData({
        ["card[2]"]: this.data.card[2].concat(x)
        //'C':this.data.C.concat(x)
       })
      }
      else
      { this.setData({
        'card[3]': this.data.card[3].concat(x)
        //'D':this.data.D.concat(x)
       })
      }
      for (var i = 0; i < 4; i++) {
        this.setData({
          ["card_len[" + i + "]"]: this.data.card[i].length, 
        })
      }
      
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
  
  
  
 