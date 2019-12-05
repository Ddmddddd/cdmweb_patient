// pages/user/user.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientid: "",
    identityCardNumber: "",
    phoneNumber: "",
    email: "",
  },

  // 绑定身份证号码，如果已绑定则不能修改
  // bindChangeId: function () {
  //   var id = this.data.identityCardNumber;
  //   if (id != "未绑定" && id.length > 0 ) {
  //     return false
  //   }
  //   else {
  //     wx.navigateTo({
  //       url: '../bindUserInfo/bindid/bindid',
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var patientid = wx.getStorageSync('patientid_token');
    var loginUserInfo = app.globalData.loginUserInfo;
    var id = loginUserInfo.identityCardNumber;
    var phone = loginUserInfo.phoneNumber;
  
    if(id==null){
      id='未绑定';
    }
    if(phone==null){
      phone='未绑定';
    }
    this.setData({
      identityCardNumber: id,
      phoneNumber: phone,
      patientid: patientid
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
    app.globalData.loginUserInfo.phoneNumber = this.data.phoneNumber;
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})