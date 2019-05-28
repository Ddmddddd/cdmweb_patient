// pages/class/class-sub/class-sub.js
import { request } from "../../../../utils/Request";
import { eduSubscribeApi } from '../../../../utils/config'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentSub: []
  },

  subChange: function(e) {
    let coid = parseInt(e.currentTarget.dataset.coid) - 1;
    let sub = this.data.currentSub[coid].sub;
    let key = "currentSub[" + coid + "].sub";
    this.setData({
      [key]: !sub
    });
  },
  subscribeRequest: function() {
    var that = this;
    var patientId = wx.getStorageSync("patientid_token");
    let course = JSON.stringify(this.data.currentSub);
    let data = {
      patientId: patientId,
      subCourses: course
    };
    let method = "POST";
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    request({
      url: eduSubscribeApi,
      data: data,
      method: method,
      header:header
    }).then(res => {
      // console.log(res.data)
      wx.navigateBack()
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(JSON.parse(options.sub));
    let currentSub = JSON.parse(options.sub);
    this.setData({
      currentSub: currentSub
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
