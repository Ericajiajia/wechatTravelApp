//app.js
const sourceSettings = {
	publicPath: `https://account.hustonline.net`
}
App({
	data: {
		deviceInfo: {}
	},
	globalData: {
		nickName: '',
		avatarUrl: '',
		gender: 0,
		id: 0,
		publicPath: 'https://account.hustonline.net',
		accountbookId: 0,
		users: [
		]
	},
	getUserInfo: function (cb) {
		let that = this
		if (this.globalData.nickName) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			// 登录
			wx.login({
				success: res => {
					if (res.code) {
						var code = res.code
						console.log('获取code:', code)
						// 获取用户信息
						wx.getUserInfo({
							withCredentials: true,
							success: res => {
								that.getDetail(code, res)
							},
							fail: res => {
								wx.showModal({
									title: '警告',
									content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
									success: function (res) {
										if (res.confirm) {
											wx.openSetting({
												success: (res) => {
													if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
														wx.getUserInfo({
															success: function (res) {
																that.getDetail(code, res)
															}
														})
													}
												}
											})
										}
									},
									confirmColor: '#39a6ff',
									showCancel: false
								})
							}
						})
					} else {
						wx.showModal({
							title: '提示',
							content: '获取用户登录态失败！' + res.errMsg
						})
					}
				}
			})
		}
	},
	getDetail: function (code, res) {
		let that = this
		// 把信息存到全局变量里面
		const userInfo = res.userInfo
		that.globalData.nickName = userInfo.nickName
		that.globalData.avatarUrl = userInfo.avatarUrl
		that.globalData.gender = userInfo.gender//性别 0：未知、1：男、2：女
		var iv = res.iv
		var signature = res.signature
		var encryptedData = res.encryptedData
		// console.log(res)
		console.log('全局变量:', that.globalData)
		// console.log(res)
		// post请求
		wx.request({
			url: `${sourceSettings.publicPath}/api/v1/users/`,
			method: 'POST',
			data: {
				"code": code
			},
			success: function (data) {
				// console.log('post请求结果:', data)
				wx.setStorageSync('session', data.data.session)
				var sessionData = wx.getStorageSync('session')
				console.log(sessionData)
				// put请求
				wx.request({
					url: `${sourceSettings.publicPath}/api/v1/users/`,
					method: 'PUT',
					header: {
						'3rd-session': sessionData
					},
					data: {
						'iv': iv,
						'signature': signature,
						'encryptedData': encryptedData
					},
					success: res => {
						that.globalData.nickName = res.data.nickName
						that.globalData.avatarUrl = res.data.avatarUrl
						that.globalData.gender = res.data.gender
						that.globalData.id = res.data.id
						// console.log(res.data)
						// console.log('putRes:', res)
						console.log('用户id：', res.data.id)
						wx.request({
							url: that.globalData.publicPath + '/api/v1/account_books/',
							method: 'GET',
							header: {
								'3rd-session': sessionData
							},
							success: res => {
								// 获取当前账本参与者信息
								if (!res.data || res.data.length == 0) {
									setTimeout(function () {
										wx.redirectTo({
											url: '../../pages/newAccount/newAccount',
										})
									}, 1000)
								} else {
									that.globalData.accountbookId = res.data[res.data.length - 1].id
									console.log(that.globalData.accountbookId)
									setTimeout(function () {
										wx.redirectTo({
											url: '../../pages/accountDetail/accountDetail',
										})
									}, 1000)
								}
								console.log(res.data)
							}
						})
					}
				})
			}
		})
	},
  onLaunch: function () {
		let that = this
		this.data.deviceInfo = wx.getSystemInfoSync()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
		// 获取用户信息
		this.getUserInfo()
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					console.log('已经授权')
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						withCredentials: true,
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo
							console.log(res.userInfo)
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				} else {
					console.log('还未授权')
					wx.authorize({
						scope: 'scope.userInfo',
						success: res => {
							console.log("同意授权1111")
						}
					})
				}
			}
		})
	}
})