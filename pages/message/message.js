// pages/message/message.js
import { request } from "../../utils/Request";
import { mesGet } from "../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowledge: [],
    count: 6,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var count = this.data.count;
    request({url:mesGet + count}).then(res=>{
      let knowledge1 = res.data.result.knowledge.map(function(item){
        var arr=item.kno_time.split(" ");
        item.kno_time=arr[0];
        return item
      })
      that.setData({
        knowledge:knowledge1
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      count: this.data.count*2
    })
    var that = this;
    var count = that.data.count;
    request({url:mesGet + count}).then(res=>{
      let knowledge1 = res.data.result.knowledge.map(function(item){
        var arr=item.kno_time.split(" ");
        item.kno_time=arr[0];
        return item
      })
      that.setData({
        knowledge:knowledge1
      })
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})