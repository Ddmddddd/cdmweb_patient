// pages/setting/setting.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientName:"",
  patientid:"",
  },
  quit:function(){
    wx.clearStorage();
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var patientName = app.globalData.loginUserInfo.name
    var patientid = wx.getStorageSync('patientid_token');
    this.setData({
      patientName:patientName,
      patientid:patientid
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
     //根据记住密码flag决定是否清除缓存
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})