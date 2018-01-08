//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		hasUserInfo: false,
		nickName: '',
		avatarUrl: '',
		gender: 0,
		id: 0
	},
	onLoad: function () {
		wx.showLoading({
			title: 'loading...'
		})
		// this.time()
		if (app.globalData.nickName) {
      this.setData({
				hasUserInfo: true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
			app.getUserInfo = res => {
        this.setData({
          hasUserInfo: true
        })
      }
		}
	}
})
