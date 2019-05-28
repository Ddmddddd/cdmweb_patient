// pages/uncomf/uncomf.js
var util = require("../../../utils/util.js");
import { tokenRequest } from "../../../utils/Request";
import { vicoDiscomfortGet } from "../../../utils/config";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uncomfname: [],
    uncomfs: [],
    date: [],

    uncomfArr: ["剧烈头痛", "恶心呕吐", "胸痛", "四肢麻木无力", "语言不清"]
  },

  parseName: function(uncomf) {
    var uncomfArr = this.data.uncomfArr;
    var discomfort = uncomf.discomfort;
    var id = 0;
    for (let index = 0; index < uncomfArr.length; index++) {
      if (discomfort.includes(uncomfArr[index])) id += Math.pow(2, index);
    }
    return id;
  },

  refresh: function() {
    var that = this;
    var now = new Date();
    var start = util.formatTime2(now) + " " + "00:00:00";
    var end = util.formatTime3(now);
    let url = vicoDiscomfortGet;
    let data = {
      measureStartDate: start,
      measureEndDate: end
    };
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    tokenRequest({ url: url, header: header, method: method, data: data }).then(
      res => {
        // console.log(res.data.data);
        if (res.data.code == 20001) {
          console.log("relogin");
          setTimeout(() => {
            that.refresh();
          }, 700);
        } else {
          let uncomf = res.data.data;
          that.setData({
            uncomfs: uncomf
          });
          if (uncomf.length >= 0) {
            var date = uncomf.map(function(item) {
              return item.happenDateTime.split(" ");
            });
            var uncomfid = uncomf.map(that.parseName);
            that.setData({
              date: date,
              feature: uncomfid
            });
          }
        }
      }
    );
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
