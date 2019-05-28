// pages/bindUserInfo/bindpassword/bindpassword.js
var encrypt= require('../../../../utils/rsaJS.js');
import { request,tokenRequest } from "../../../../utils/Request";
import { vicoPasswordChange,vicoRsa } from "../../../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    former_password:"",
    new_password:"",
    rsaKey:""
  },

  bindInputOldPassword:function(e){
    this.setData({
      former_password: e.detail.value,
    })
  },
  bindInputNewPassword: function (e) { 
    this.setData({
      new_password: e.detail.value,
    })
  },

  change: function () {
    
    let oldP = this.data.former_password;
    let newP = this.data.new_password;
    encrypt.setPublicKey(this.data.rsaKey)
    if (newP == oldP) {
      wx.showToast({
        title: '新旧密码相同，请重新输入',
        icon:'none'
      })
      return false
    }  
    let oldPassword = encrypt.encrypt(oldP)
    let newPassword = encrypt.encrypt(newP)
    let url = vicoPasswordChange
    let data = {
      oldPassword:oldPassword,
      newPassword:newPassword,
      encryption:"rsa"
    }
    let method = "POST"
    let token = wx.getStorageSync('login_token');
    let header = {
      "token":token,
      "content-type": "application/json" 
    }
    tokenRequest({url:url, header:header, method:method, data:data}).then(res=>{
      if (res.data.code == 20001) {
        console.log('relogin')
        setTimeout(()=>{
          that.refresh()
        },700)
      } else {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
        setTimeout(()=>{
          wx.navigateBack()
        },1500)
      }
    })

  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({url:vicoRsa,method:"POST"}).then(res=>{
      this.setData({
        rsaKey : res.data.data,
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})