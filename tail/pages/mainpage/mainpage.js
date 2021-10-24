// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    startgame:function(){
      wx.navigateTo({
        url:'../mode_choose/mode_choose',
      })
    },
    viewrule:function(){
      wx.navigateTo({
        url:'../rule_introduction/rule_introduction',
      })
      },
 
})