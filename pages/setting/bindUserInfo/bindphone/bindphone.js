// pages/bindUserInfo/bindphone/bindphone.js
import { tokenRequest,validatePhone } from "../../../../utils/Request";
import { vicoPhoneChange } from "../../../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    former_phone: "",
    new_phone: "",
  },

  bindInputPhone: function (e) {
    this.setData({
      new_phone: e.detail.value,
    })
  },


  change: function () {
    var phoneNumber = this.data.new_phone;
    if(!phoneNumber){
      wx.showToast({
        title: '新手机号不能为空',
        icon:'none'
      })
      return false
    }
    if (!validatePhone(phoneNumber)) {
      wx.showToast({
        title: '新手机号输入有误',
        icon:'none'
      })
      return false
    } 
    let url = vicoPhoneChange
    let data = {
      phoneNumber:phoneNumber
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
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            phoneNumber: phoneNumber
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
    var former_phone = options.phone;
    if (former_phone != undefined) {
      this.setData({
        former_phone: former_phone
      })
    }
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