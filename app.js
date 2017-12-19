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
		publicPath: 'https://account.hustonline.net',
		accountbookId: 2,
		users: []
	},
  onLaunch: function () {
		var that = this
		this.data.deviceInfo = wx.getSystemInfoSync()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
		// 登录
		wx.login({
			success: function (res) {
				if (res.code) {
					var code = res.code
					console.log('code:', code)
					// 获取用户信息
					wx.getUserInfo({
						withCredentials: true,
						success: res => {
							// 把信息存到全局变量里面
							const userInfo = res.userInfo
							that.globalData.nickName = userInfo.nickName
							that.globalData.avatarUrl = userInfo.avatarUrl
							that.globalData.gender = userInfo.gender//性别 0：未知、1：男、2：女
							var iv = res.iv
							var signature = res.signature
							var encryptedData = res.encryptedData
							console.log('全局变量:', that.globalData)
							console.log(res)
							// post请求
							wx.request({
								url: `${sourceSettings.publicPath}/api/v1/users/`,
								method: 'POST',
								data: {
									"code": code
								},
								success: function (data) {
									console.log('post请求结果:', data)
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
											console.log('putRes:', res)
											wx.request({
												url: `${sourceSettings.publicPath}/api/v1/account_books/` + that.globalData.accountbookId + `/`,
												method: 'GET',
												success: res => {
													// 获取当前账本参与者信息
													that.globalData.users = res.data.participants
												}
											})
										}
									})
								}
							})
						}
					})
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		})
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
		// 		console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		// 			wx.getUserInfo({
		// 				withCredentials: true,
    //         success: res => {
		// 					console.log('in in in')
    //           // 可以将 res 发送给后台解码出 unionId
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {
		// 			wx.authorize({
		// 				scope: 'scope.userInfo',
		// 				success: function (res) {
		// 					console.log('in')
		// 				}
		// 			})
		// 		}
    //   }
    // })
	}
})