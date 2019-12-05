// pages/medicine/medicine.js
var util = require("../../../utils/util.js");
import { tokenRequest } from "../../../utils/Request";
import { vicoDrugGet } from "../../../utils/config";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    medname: [],
    medvalue: [],
    medicines: [],
    date: []
  },

  gettab: function(med) {
    var tabname = med.drugName;
    return tabname.split(",");
  },
  getvalue: function(med) {
    var value = med.dosage;
    return value.split(",");
  },

  refresh: function() {
    var that = this;
    // 获取当日时间
    var now = new Date();
    var start = util.formatTime2(now) + " " + "00:00:00";
    var end = util.formatTime3(now);
    let url = vicoDrugGet;
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
          let med = res.data.data;
          that.setData({
            medicines: med
          });
          if (med.length >= 0) {
            var date = med.map(function(item) {
              return item.useDateTime.split(" ");
            });
            var medname = med.map(that.gettab);
            var medvalue = med.map(that.getvalue);
            that.setData({
              medname: medname,
              medvalue: medvalue,
              date: date
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
