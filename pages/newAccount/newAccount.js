const app = getApp()

Page({
  data: {
    head_picture_url: '../../images/head_container_picture.png',
    dates: '请输入旅行时间',
    active1: '',
    accountInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
    })
  },
  onLoad: function () {
  },
  getUserInfo: function (e) {   
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value,
      active1: 'active1'
    })
  }
})
