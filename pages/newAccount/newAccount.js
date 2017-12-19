const app = getApp()

Page({
  data: {
    head_picture_url: '../../images/head_container_picture.png',
    dates: '请选择旅行时间',
    active1: '',
		locationInfo: '',
		locationFocus: false
  },
	getLocation: function (e) {
		console.log(e.detail.value)
		this.setData({
			locationInfo: e.detail.value
		})
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
  },
	newAccount: function () {
		let that = this
		console.log(that.data.locationInfo, that.data.active1, that.data.dates)
		if (!that.data.locationInfo) {
			wx.showModal({
				title: '页面提示',
				content: '请输入旅行目的地',
				showCancel: false,
				confirmText: '我知道了',
				success: res => {
					console.log(res)
				}
			})
			return
		} else if (!that.data.active1) {
			wx.showModal({
				title: 'dqdqw',
				content: 'cwecwe',
			})
			return
		} else {
			wx.request({
				url: app.globalData.publicPath + '/api/v1/account_books/',
				method: 'POST',
				data: {
					'destination': that.data.locationInfo,
					'time': that.data.dates
				},
				header: {
					'content-type': 'application/json'
				}, 
				success: res => {
					console.log('success:', res)
				},
				fail: res => {
					console.log('fail:', res)
				}
			})
		}
	}
})
