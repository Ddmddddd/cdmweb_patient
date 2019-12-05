// pages/eat/eat.js
var util = require("../../../utils/util.js");
import { tokenRequest } from "../../../utils/Request";
import { vicoDietGet } from "../../../utils/config";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    foodtype: [],
    appetite: [],
    foods: [],
    date: [],

    eattype: [],
    hidden: 0,
    foodArr: app.globalData.foodArr,
    typeArr: ["其他","早餐", "午餐", "晚餐"]
  },

  parseFoodKind: function(food) {
    var arr = food.kinds.split(",");
    return arr;
  },

  parseFoodAppetite: function(food) {
    var str = food.appetite.split(",");
    return str;
  },

  parseType: function(food) {
    var type = food.type;
    let weight = 0;
    if (type > 0 && type < 4) {
      weight = Math.pow(2, type);
    } else {
      type = 0;
    }
    this.setData({
      hidden: this.data.hidden + weight
    });
    return this.data.typeArr[type];
  },

  refresh: function() {
    var that = this;
    var token = wx.getStorageSync("login_token");
    var now = new Date();
    var start = util.formatTime2(now) + " " + "00:00:00";
    var end = util.formatTime3(now);
    let url = vicoDietGet;
    let header = {
      token: token,
      "content-type": "application/json"
    };
    let data = {
      measureStartDate: start,
      measureEndDate: end
    };
    let method = "POST";
    tokenRequest({ url: url, header: header, method: method, data:data}).then(res => {
      if (res.data.code == 20001) {
        console.log('relogin')
        setTimeout(()=>{
          that.refresh()
        },700)
      } else {
        let diet = res.data.data;
        that.setData({
          foods: diet,
          hidden: 0
        });
        if (diet.length != 0) {
          var date = diet.map(function(item) {
            return item.happenDateTime.split(" ");
          });
          // console.log(date)
          var foodtype = diet.map(that.parseFoodKind);
          var appetite = diet.map(that.parseFoodAppetite);
          var eattype = diet.map(that.parseType);
          that.setData({
            foodtype: foodtype,
            appetite: appetite,
            eattype: eattype,
            date: date
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refresh();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
