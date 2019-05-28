// pages/class/class-learn/class-learn.js
import { request } from "../../../../utils/Request";
import { eduWXKnowledgeDetailApi, eduRecordApi, eduFavorApi } from '../../../../utils/config'
const wxParser = require('../../../../wxParser/index');
Page({
  /**R
   * 页面的初始数据
   */
  data: {
    studyList: [],
    studyIndex: 0,
    studyingItem: {},
    timestep:0,
    lasttime:0
  },
  /**
   * 获取某知识的具体数据
   * POST patientId kid
   */
  knowledgeInfo: function(patientId, kid) {
    var that = this;
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let url = eduWXKnowledgeDetailApi;
    let data = {
      patientId: patientId,
      kid: kid
    };
    let method = "POST";
    request({
      url: url,
      header: header,
      data: data,
      method: method
    }).then(res => {
      const { result } = res.data
      that.setData({
        studyingItem: result
      });
      if (result.type == 1){
        wxParser.parse({
          bind: 'richText',
          html: result.content,
          target: that,
          enablePreviewImage: false, // 禁用图片预览功能
          tapLink: (url) => { // 点击超链接时的回调函数
            // url 就是 HTML 富文本中 a 标签的 href 属性值
            // 这里可以自定义点击事件逻辑，比如页面跳转
          }
        })
      }
    });
  },
  /**
   * 完成学习
   * 若最后一条 出现弹窗（你确定完成本节课程的学习了吗） 确定=>learnedRequest navigateback 取消=>弹窗消失，不执行其他行为
   * 非最后一条 直接执行Learned request studyindex++并更新内容studyingitem
   * kid duration
   */
  finishLearning: function() {
    var that = this;
    var thistime = new Date().getTime()
    var duration = thistime - that.data.lasttime
    if (this.data.studyList.length - 1 <= this.data.studyIndex) {
      // 最后一条知识
      wx.showModal({
        title: "完成学习？",
        content: "你确定完成了本节课程的学习了吗？",
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            console.log("确定");
            wx.showToast({
              duration: 1500
            });
            that.learnedRequest(duration)
            setTimeout(() => {
              wx.navigateBack({});
            }, 1000);
          } else if (res.cancel) {
            console.log("取消");
          }
        }
      });
    } else {
      //非最后一条
      that.learnedRequest(duration)
      let patientId = that.data.patientId;
      let studyIndex = that.data.studyIndex;
      studyIndex++;
      that.setData({
        studyIndex: studyIndex,
        lasttime:thistime
      });
      let kid = that.data.studyList[studyIndex].kid;
      that.knowledgeInfo(patientId, kid);
    }
  },
  learnedRequest: function(duration = 10000) {
    //当前kid知识已学习
    var that = this;
    var patientId = wx.getStorageSync("patientid_token");
    var id = this.data.studyList[this.data.studyIndex];
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let data = {
      patientId: patientId,
      kid: id.kid,
      cid: id.cid,
      duration: duration
    };
    let method = "POST";
    request({
      url: eduRecordApi,
      header: header,
      data: data,
      method: method
    }).then(res => {
      if (res.data.result == "success") {
        console.log("已学习");
      }
    });
  },
  /**
   * 喜爱课程
   * patientId kid
   */
  favorChange: function() {
    var that = this;
    var patientId = wx.getStorageSync("patientid_token");
    var kid = this.data.studyList[this.data.studyIndex].kid;
    var favor = this.data.studyingItem.favor ? false : true;
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let data = {
      patientId: patientId,
      kid: kid,
      favor: favor
    };
    let method = "POST";
    // console.log(data)
    request({
      url: eduFavorApi,
      header: header,
      data: data,
      method: method
    }).then(res => {
      if (res.data.result == "success") {
        that.setData({
          "studyingItem.favor": favor
        });
        wx.showToast({
          title: favor ? "收藏成功" : "已取消收藏"
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var patientId = wx.getStorageSync("patientid_token");
    var studyList = JSON.parse(options.kid);
    this.setData({
      studyList: studyList,
      patientId: patientId
    });
    this.knowledgeInfo(patientId, studyList[0].kid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      lasttime : new Date().getTime()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
