var app = getApp();
var encrypt= require('../../utils/rsaJS.js');
import { request } from "../../utils/Request";
import { vicoLoginUrl,vicoCaptcha,vicoRsa } from "../../utils/config";
Page({
  data: {
    userName: "",
    userPassword: "",
    showPsw: false,
    captchaRequire:false,
    captchaId:'jiadeyzmidr4k',
    imageValue:'',
    captchaValue:'jiadeyzm'
  },

  /**
   * 数据
  */
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    });
  },
  userPasswordInput: function(e) {
    this.setData({
      userPassword: e.detail.value
    });
  },
  switchShowPassword: function() {
    this.setData({
      showPsw: !this.data.showPsw
    });
  },
  userCaptchaInput:function(e){
    this.setData({
      captchaValue:e.detail.value
    })
  },
  /**
   * 登陆 获取token
   * 失败三次调取验证码接口
   */
  logIn: function() {
    var that = this;
    var account = this.data.userName;
    var password = this.data.userPassword;
    encrypt.setPublicKey(this.data.rsaKey)
    let encryptPW = encrypt.encrypt(password)
    // console.log(password)
    // console.log(encryptPW)
    if (account.length <= 0) {
      wx.showToast({
        title: "请输入信息",
        image: "../../image/fail.png",
        duration: 2000
      });
    } else {

      let url =  vicoLoginUrl;
      let data = {
        account: account,
        password: encryptPW,
        captchaId: that.data.captchaId,
        captchaValue: that.data.captchaValue,
        encryption: "rsa"
      };
      let method = "POST";
      request({ url: url, data: data, method: method }).then(res => {
        // 请求成功，检验登录信息
        // wx.showToast({
        //   title: "登陆中..."
        // });
        const data = res.data.data
        if (!data) {
          //出错三次 captchaRequire true
          if (res.data.code == 10001){
            request({url:vicoCaptcha,method:method}).then(res=>{
              that.setData({
                captchaId:res.data.data.id,
                imageValue:res.data.data.value,
                rsaKey:res.data.data.rsaKey,
                captchaRequire:true
              })
            })
          }
        } else {
            wx.setStorageSync("patientid_token", data.account);
            wx.setStorageSync("password_token", that.data.userPassword);
            wx.setStorageSync("login_token", data.token);
            wx.switchTab({
              url: "../new_homepage/new_homepage"
            });
        }
      });
    }
  },
  /**
   * 请求新的验证码
   */
  newCaptcha:function(){
    request({url:vicoCaptcha,method:'POST'}).then(res=>{
      this.setData({
        captchaId:res.data.data.id,
        imageValue:res.data.data.value,
        rsaKey:res.data.data.rsaKey,
        // captchaRequire:true
      })
    })
  },
  /**
   * 页面初始化
   */
  onLoad: function(options) {
    /* 获取系统信息*/
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.windowWidth = res.windowWidth;
        app.globalData.windowHeight = res.windowHeight;
      }
    });
    var patientId = wx.getStorageSync("patientid_token");
    var password = wx.getStorageSync("password_token");
    this.setData({
      userName: patientId,
      userPassword: password
    });

    request({url:vicoRsa,method:"POST"}).then(res=>{
      this.setData({
        rsaKey : res.data.data,
      })
      if (this.data.userName.length > 0) {
        this.logIn();
      }
    })

  },

  /**
   * 跳转注册页面
   */
  register: function() {
    wx.navigateTo({
      url: "../register/register"
    });
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
});
