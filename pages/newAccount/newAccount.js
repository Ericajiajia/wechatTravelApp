const app = getApp()

Page({
  data: {
    head_picture_url: '../../images/head_container_picture.png',
    dates: '请选择旅行时间',
    active1: '',
    accountInfo: {},
		locationFocus: false
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
	locationFocus: function () {
		this.setData({
			locationFocus: true
		})
	},
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value,
      active1: 'active1'
    })
  }
})
