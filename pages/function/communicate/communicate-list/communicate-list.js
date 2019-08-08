// pages/communicate/communicate-list/communicate-list.js
import {vicoBloodGlucoseGet} from "../../../../utils/config";

var util = require('../../../../utils/util.js');
import { tokenRequest } from "../../../../utils/Request";
import { vicoDoctorListGet } from "../../../../utils/config";
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        chatList : [],
    },


    /**
     * 刷新数据函数
     */
    refresh:function(){
        var that=this;

    },

    /*
    * 创建websocket连接
    * */
    openWS: function(){
        var that = this
        let token = wx.getStorageSync("login_token");
        let url =
            "wss://test.zjubiomedit.com/patient.api/socket/notify/subscribe?token=" +
            token;
        if (
            app.globalData.localSocket.readyState !== 0 &&
            app.globalData.localSocket.readyState !== 1
        ) {
            console.log(
                "开始尝试连接WebSocket！readyState=" +
                app.globalData.localSocket.readyState
            );
            app.initSocket(url);
        }

        app.globalData.callback = function(res) {
            // 接收到最新消息，使用最简单的方式，从新调一次获取列表方法
            that.getChatList();
        };
    },

    /*
    * 获取和医生的聊天记录列表
    * */
    getChatList: function(){
        let url = vicoDoctorListGet
        let data = {
            patientID:wx.getStorageSync('patientid_token')
        }
        let method = "POST"
        let token = wx.getStorageSync('login_token');
        let header = {
            "token":token,
            "content-type": "application/json"
        }
      tokenRequest({ url: url, header: header, method: method, data: null}).then(res=>{
            console.log(res)
            if (res.data.code == 0) {
                let data = res.data.data;
                this.setData({
                  chatList: data
                })
            }
        })
    },
    gotoChat: function(e){
      let chatModel = JSON.stringify(e.currentTarget.dataset['chat']);
      wx.navigateTo({
        url: '../communicate-chat/communicate-chat?chatInfo=' + chatModel
      })
    },









    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.openWS();
        this.getChatList();
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
        this.refresh()
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
