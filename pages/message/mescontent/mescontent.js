const wxParser = require('../../../wxParser/index');
import { request } from "../../../utils/Request";
import { mesContentGet } from "../../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    id: 0,
    url: "https://edu.zjubiomedit.com/health-knowledge/getKnoContent.jsp?kno_id=",
    link: '',
    name: '',
    time: '',
    readtime: 3,
    img: [{
      name: 'img',
      attrs: {
        src: "http://120.27.141.50:8080/health-knowledge/upload/drug-54.jpg",
        width: "100%",
      },
    }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    var that = this;
    var id = options.id;
    // this.setData({
    //   id: id
    // })
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    request({url:mesContentGet + id , method:'POST' ,header:header}).then(res=>{
      that.setData({
        link: res.data.result.kno_link,
        name: res.data.result.kno_name,
        time: res.data.result.kno_time,
        readtime: res.data.result.read_time,
        'img[0].attrs.src': res.data.result.kno_link,
      })
      wxParser.parse({
        bind: 'richText',
        html: res.data.result.kno_content,
        target: that,
        enablePreviewImage: false, // 禁用图片预览功能
      });
      that.setData({
        showPage: true
      });
      wx.hideLoading();
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