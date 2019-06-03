// pages/exchange/exchange.js
var util = require('../../../utils/util.js');
import { tokenRequest } from "../../../utils/Request";
import { vicoBloodGlucoseGet } from "../../../utils/config";
// import * as echarts from '../../components/ec-canvas/echarts.min';
// var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ec: {
            lazyLoad: true
        },

    },

    NavChart:function(){
        let data = JSON.stringify(this.data.bgs)
        wx.navigateTo({
            url: '../charts/bgcalendar/bgcalendar?data=' + data,
        })
    },
    /**
     * 刷新数据函数
     */
    refresh:function(){
        var that=this;

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
        this.refresh()
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