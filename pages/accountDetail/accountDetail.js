const app = getApp()
Page({
	data: {
		title: {
			location: '',
			time: '',
			users: []
		},
		textNone: 'textNone',
		summoney: '00.00',
		sort: {
			selected1: 'selected1',	
			selected2: ''
		},
		detailShow1: [],
		detailShow2: [],
		noneArray: ['暂无公账记录', '暂无私账记录'],
		billNone: 'billNone',
		billHave: ['', 'billHave'],
		noneContent: '暂无私账记录',
		imageSelect: [
			'../../images/sort_select/food_yes.png',
			'../../images/sort_select/bus_yes.png',
			'../../images/sort_select/hotel_yes.png',
			'../../images/sort_select/shopping_yes.png',
			'../../images/sort_select/ticket_yes.png',
			'../../images/sort_select/play_yes.png',
			'../../images/sort_select/other_yes.png'
		],
		imageList: ['餐饮', '交通', '住宿', '购物', '订票', '娱乐', '其他'],
		show0: 'show0',
		show1: 'show1',
		shareButton: 0,
		share: {
			backNone: 'backNone',
			areaNone: 'areaNone',
			canvasNone: 'canvasNone',
			imageUrl: app.globalData.avatarUrl,
			summary: '早餐',
			money: '50.00',
			codeUrl: app.globalData.avatarUrl
		}
	},
	onShow: function () {
		const that = this
		const sessionData = wx.getStorageSync('session')
		// 获取已经参加该账本的小伙伴
		wx.request({
			url: app.globalData.publicPath + '/api/v1/account_books/' + app.globalData.accountbookId + '/',
			method: 'GET',
			header: {
				'3rd-session': sessionData
			},
			success: res => {
				// 得到我的总花费
				let sum = that.getSummoney(res.data)
				console.log(res.data)
				// 得到公账和私账的清单
				that.setDetailList(res.data)
				// 初始显示公账详情
				that.publicBill()
				// 获取当前账本参与者信息
				that.setData({
					title: {
						location: res.data.destination,
						time: that.getTimeFull(res.data.time),
						users: res.data.participants
					},
					summoney: sum
				})
				// 获取当前账本的参与者
				app.globalData.users = res.data.participants
				if (that.data.title.users.length) {
					that.setData({
						textNone: 'textNone'
					}) 
				} else {
					that.setData({
						textNone: ''
					})
				}
			}
		})
	},
	getTimeFull: function (time) {
		let date = new Date(time)
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		if (month < 10) {
			month = '0' + month
		}
		let day = date.getDate()
		if (day < 10) {
			day = '0' + day
		}
		if (year != 'NaN' || month != 'NaN' || day != 'NaN') {
			return year + '-' + month + '-' + day
		} else {
			return ''
		}
	},
	setDetailList: function (data) {
		let detailShow1 = [], detailShow2 = [], detailPer = {}
		let that = this
		for (let i = 0; i < data.publicBills.length; i ++) {
			detailPer = {}
			if (data.publicBills[i] == {}) {
				continue
			}
			detailPer.imageUrl = that.getImageUrl(data.publicBills[i].category)
			detailPer.sort = that.getSummary(data.publicBills[i].summary)
			detailPer.price = that.checkSum(data.publicBills[i].sum)
			detailPer.id = data.publicBills[i].id
			detailPer.participantsNum = that.checkParticipants(data.publicBills[i].participants)
			detailPer.pricePer = (detailPer.price / detailPer.participantsNum).toFixed(2)
			detailPer.time = that.getTime(data.publicBills[i].time)
			detailPer.userImage = that.getUserImage(data.publicBills[i].payerId)
			detailPer.visible = that.getVisible(data.publicBills[i])
			detailPer.beforeRound = that.getBefore(data.publicBills[i].isSettled)
			detailShow1.push(detailPer)
		}
		for (let i = 0; i < data.privateBills.length; i++) {
			detailPer = {}
			if (data.privateBills[i] == {} || !data.privateBills[i].category) {
				continue
			}
			detailPer.imageUrl = that.getImageUrl(data.privateBills[i].category)
			detailPer.sort = that.getSummary(data.privateBills[i].category)
			detailPer.id = data.privateBills[i].id
			detailPer.price = that.checkSum(data.privateBills[i].sum)
			detailPer.time = that.getTime(data.privateBills[i].time)
			detailShow2.push(detailPer)
		}
		that.setData({
			detailShow1: detailShow1,
			detailShow2: detailShow2
		})
	},
	getVisible: function (data) {
		console.log(app.globalData.id, data.payerId)
		if (app.globalData.id == data.payerId) {
			if (data.isSettled) {
				return 1
			} else {
				return 0
			}
		} else {
			return 2
		}
	},
	getSummary: function (str) {
		if (str.length > 5) {
			return str.substring(0, 5) + '...'
		} else {
			return str
		}
	},
	getBefore: function (bool) {
		if (bool) {
			return 'beforeNone'
		} else {
			return ''
		}
	},
	// 把花费统一显示格式
	checkSum: function (sum) {
		let sum1 = sum / 100
		return sum1.toFixed(2)
	},
	getUserImage: function (num) {
		for (let i = 0; i < app.globalData.users.length; i ++) {
			if (app.globalData.users[i].id == num) {
				return app.globalData.users[i].avatarUrl
			} 
		}
		if (app.globalData.id == num) {
			return app.globalData.avatarUrl
		}
	},
	checkParticipants: function (par) {
		if (!par) {
			return 1
		} else {
			return par.length
		}
	},
	// 每笔账单的图标
	getImageUrl: function (cate) {
		var that = this
		for (let i = 0; i < that.data.imageList.length; i ++) {
			if (cate == that.data.imageList[i]) {
				return that.data.imageSelect[i]
			}
		}
	},
	// 显示时间
	getTime: function (time) {
		let time1 = new Date(time)
		let now = new Date()
		switch (now.getFullYear() - time1.getFullYear()) {
			case 0: 
				if (now.getMonth() - time1.getMonth() == 0 && now.getDate() - time1.getDate() == 0) {
					return '今天'
				} else if (now.getMonth() - time1.getMonth() == 0 && now.getDate() - time1.getDate() == 1) {
					return '昨天'
				} else {
						let month = time1.getMonth() + 1
						let date = time1.getDate()
						let time2 = month + '-' + date
						return time2
				}
			default:
				let year = time1.getFullYear()
				let month = time1.getMonth() + 1
				let date = time1.getDate()
				let time2  = year + '-' + month + '-' + date
				return time2
		}
	},
	// 得到我的总花费
	getSummoney: function (data) {
		let sum = 0
		let length1 = data.privateBills.length
		let length2 = data.publicBills.length
		let length3 = 0
		for (let i = 0; i < length1; i++) {
			if (!data.privateBills[i].sum) {
				data.privateBills[i].sum = 0
			}
			sum += data.privateBills[i].sum
		}
		for (let i = 0; i < length2; i++) {
			if (!data.publicBills[i].sum) {
				data.publicBills[i].sum = 0
			}
			if (!data.publicBills[i].participants) {
				length3 = 1
			} else {
				length3 = data.publicBills[i].participants.length
			}
			sum += data.publicBills[i].sum / length3
		}
		sum = this.checkSum(sum)
		return sum
	},
	onShareAppMessage: function (res) {
		let that = this
		// 邀请他人加入账本
		if (res.from === 'button' && this.data.shareButton == 0) {
			return {
				title: app.globalData.nickName + '邀请你加入' + this.data.title.location + '(' + this.data.title.time + ')',
				path: 'pages/addToAccount/addToAccount?accountbookId=' + app.globalData.accountbookId
			}
		} else if (res.from === 'button' && this.data.shareButton == 1) {
			// 提醒别人添加自己的二维码
			return {
				title: app.globalData.nickName + '提醒你添加自己的二维码',
				path: '/pages/codeUpload/codeUpload'
			}
		} else {
			// 转发邀请别人加入账本
			return {
				title: app.globalData.nickName + '邀请你加入' + this.data.title.location + '(' + this.data.title.time + ')',
				path: 'pages/addToAccount/addToAccount?accountbookId=' + app.globalData.accountbookId
			}
		}
	},
	// 添加队友
	addUser: function () {
		this.setData({
			shareButton: 0
		})
	},
	// info显示与隐藏
	showModal: function () {
		this.setData({
			show0: ''
		})
	},
	hideModal: function () {
		this.setData({
			show0: 'show0'
		})
	},
	// 显示菜单
	showMenu: function () {
		this.setData({
			show1: ''
		})
	},
	// 隐藏菜单
	hideMenu: function () {
		this.setData({
			show1: 'show1'
		})
	},
	addAccount: function () {
		wx.navigateTo({
			url: '../newDetail/newDetail'
		})
	},
	// 公账样式设置
	sortPublic: function () {
		this.publicBill()
	},
	publicBill: function () {
		let that = this
		that.setData({
			sort: {
				selected1: 'selected1',
				selected2: ''
			}
		})
		if (that.data.detailShow1.length) {
			that.setData({
				billNone: 'billNone',
				billHave: ['', 'billHave']
			})
		} else {
			that.setData({
				billNone: '',
				billHave: ['billHave', 'billHave'],
				noneContent: that.data.noneArray[0]
			})
		}
	},
	// 私账样式设计
	sortPrivate: function () {
		this.privateBill()
	},
	privateBill: function () {
		let that = this
		that.setData({
			sort: {
				selected1: '',
				selected2: 'selected2'
			}
		})
		if (that.data.detailShow2.length) {
			that.setData({
				billNone: 'billNone',
				billHave: ['billHave', '']
			})
		} else {
			that.setData({
				billNone: '',
				billHave: ['billHave', 'billHave'],
				noneContent: that.data.noneArray[1]
			})
		}
	},
	closeMenu: function () {
		let that = this
		setTimeout(function () {
			that.setData({
				show1: 'show1'
			})
		}, 500)
	},
	noHurry: function (e) {
		let that = this
		let visibleChange = 'detailShow1[' + e.currentTarget.dataset.listid + '].visible'
		console.log(e.currentTarget.dataset.listid, visibleChange)
		that.setData({
			[visibleChange]: 0
		})
		let session = wx.getStorageSync('session')
		wx.request({
			url: app.globalData.publicPath + '/api/v1/bills/public/' + e.currentTarget.dataset.id + '/',
			method: 'PUT',
			data: {
				isSettled: false
			},
			header: {
				'3rd-session': session
			},
			success: res => {
			}
		})
	},
	chooseHurry: function (e) {
		let that = this
		wx.showActionSheet({
			itemList: ['分享给朋友', '款项已结清'],
			itemColor: "#000000",
			success: function (res) {
				if (!res.cancel) {
					if (res.tapIndex == 0) {
						// 展示要分享出去的卡片
						wx.request({
							url: app.globalData.publicPath + '/api/v1/users/' + app.globalData.id + '/',
							method: 'GET',
							success: res => {
								if (!res.data.qrCode) {
									wx.showModal({
										title: '提示',
										content: '抱歉，你还未上传收款码，快去上传吧！',
										confirmText: '去上传',
										confirmColor: '#39a6ff',
										success: res => {
											if (res.cancel) {
												return
											} else {
												wx.navigateTo({
													url: '../codeUpload/codeUpload',
												})
											}
										}
									})
								} else {
									that.drawCard(that.data.share.summary, that.data.share.money, app.globalData.avatarUrl, res.data.qrCode)
									that.setData({
										'share.backNone': '',
										'share.areaNone': 'areaNone',
										'share.canvasNone': ''
									})
								}
							}
						})
					} else if (res.tapIndex == 1) {
						let visibleChange = 'detailShow1[' + e.currentTarget.dataset.listid + '].visible'
						console.log(e.currentTarget.dataset.listid, visibleChange)
						that.setData({
							[visibleChange]: 1
						})
						let session = wx.getStorageSync('session')
						wx.request({
							url: app.globalData.publicPath + '/api/v1/bills/public/' + e.currentTarget.dataset.id + '/',
							method: 'PUT',
							data: {
								isSettled: true
							},
							header: {
								'3rd-session': session
							},
							success: res => {
								wx.showToast({
									title: '已结清',
								})
								console.log(res)
							}
						})
					}
				}
			}
		})
	},
	showCard: function () {
		that.setData({
			'share.backNone': '',
			'share.areaNone': ''
		})
	},
	previewImage: function (e) {
		let current = e.currentTarget.src, that = this
		wx.previewImage({
			current: current,
			urls: [that.data.share.codeUrl]
		})
	},
	closeCard: function () {
		this.setData({
			'share.backNone': 'backNone',
			'share.areaNone': 'areaNone',
			'share.canvasNone': 'canvasNone'
		})
	},
	drawCard: function (info1, info2, url1, url2) {
		wx.downloadFile({
			url: url1, 
			success: function (res1) {
				console.log(res1)
				if (res1.statusCode == 200) {
					wx.downloadFile({
						url: url2,
						success: function (res2) {
							console.log(res2)
							if (res2.statusCode == 200) {
								var ctx = wx.createCanvasContext()
								ctx.beginPath()
								ctx.setStrokeStyle('rgb(225, 225, 225)')
								ctx.moveTo(0, 70)
								ctx.lineTo(250, 70)
								ctx.stroke()
								ctx.closePath()
								ctx.setFontSize(17)
								let info3 = info1 + '　' + info2
								ctx.fillText(info3, 78, 28)
								ctx.fillText('向TA支付', 78, 56)
								ctx.setTextAlign('center')
								ctx.fillText('点开图片并长按', 125, 267)
								ctx.setFontSize(14)
								ctx.setTextAlign('center')
								ctx.fillText('微信收款码-识别二维码', 125, 295)
								ctx.setTextAlign('center')
								ctx.fillText('支付宝收款码-保存图片', 125, 315)
								ctx.save()
								ctx.beginPath()
								ctx.arc(40, 35, 25, 0, 2 * Math.PI)
								ctx.clip()
								ctx.drawImage(res1.tempFilePath, 15, 10, 50, 50)
								ctx.restore()
								ctx.drawImage(res2.tempFilePath, 52, 90, 145, 145)
								wx.drawCanvas({
									canvasId: 'firstCanvas',
									actions: ctx.getActions()
								})
							}
						}
					})
				}
			}
		})
	},
	saveCanvas: function () {
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			fileType: 'jpg',
			canvasId: 'firstCanvas',
			success: function (res) {
				console.log(res.tempFilePath)
			}
		})
	},
	closeShare: function () {
		this.setData({
			'share.backNone': 'backNone',
			'share.areaNone': 'areaNone',
			'share.canvasNone': 'canvasNone'
		})
	}
})