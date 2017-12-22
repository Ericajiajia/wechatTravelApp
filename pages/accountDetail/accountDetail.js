// 注释了wx.request
const app = getApp()
Page({
	data: {
		title: {
			location: '上海',
			time: '2017-11-22',
			users: []
		},
		textNone: 'textNone',
		summoney: '3200.00',
		sort: {
			selected1: 'selected1',
			selected2: ''
		},
		detailShow1: [
			{
				imageUrl: '../../images/sort_select/food_yes.png',
				sort: '餐饮是是v',
				id: 1,
				time: '今天',
				price: 562.20,
				pricePer: 22.96,
				participantsNum: 3,
				userImage: '',
				visible: 0,
				beforeRound: 'beforeRound'
			},
			{
				imageUrl: '../../images/sort_select/hotel_yes.png',
				sort: '餐饮备份的...',
				id: 2,
				time: '今天',
				price: 645.00,
				pricePer: 25.55,
				participantsNum: 5,
				userImage: '',
				visible: 0,
				beforeRound: ''
			},
			{
				imageUrl: '../../images/sort_select/other_yes.png',
				sort: '餐饮',
				id: 3,
				time: '2014-12-31',
				price: 59.88,
				pricePer: 20.00,
				participantsNum: 3,
				userImage: '',
				visible: 0,
				beforeRound: ''
			}
			],
		detailShow2: [
			{
				imageUrl: '../../images/sort_select/other_yes.png',
				sort: '餐饮',
				id: 1,
				time: '2014-12-31',
				price: 59.88
			}
		],
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
		shareButton: 0
	},
	// 邀请别人加入
	onShareAppMessage: function () {
		return {
			title: '旅行记账',
			desc: '邀请您加入账本',
			path: '/pages/accountDetail/accountDetail'
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
					'title.users': res.data.participants,
					summoney: sum
				})
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
			console.log(data.privateBills[i])
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
		console.log(detailShow1, detailShow2)
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
			return par.length + 1
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
				length3 = 0
			} else {
				length3 = data.publicBills[i].participants.length
			}
			sum += data.publicBills[i].sum / (length3 + 1)
		}
		sum = this.checkSum(sum)
		return sum
	},
	onShareAppMessage: function (res) {
		let that = this
		if (res.from === 'button' && this.data.shareButton == 0) {
			return {
				title: app.globalData.nickName + '邀请你加入' + this.data.title.location + '(' + this.data.title.time + ')',
				path: 'pages/addToAccount/addToAccount'
			}
		} else if (res.from === 'button' && this.data.shareButton == 1) {
			return {
				title: app.globalData.nickName + '提醒你添加自己的二维码',
				path: '/pages/codeUpload/codeUpload'
			}
		} else {
			return {

			}
		}
	},
	// 添加队友
	addUser: function () {
		
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
	chooseHurry: function (e) {
		let that = this
		wx.showActionSheet({
			itemList: ['分享给朋友', '款项已结清'],
			itemColor: "rgb(95, 95, 95)",
			success: function (res) {
				if (!res.cancel) {
					if (res.tapIndex == 0) {
						// 分享给朋友图片生成的二维码
					} else if (res.tapIndex == 1) {
						let visibleChange = 'detailShow1[' + e.currentTarget.dataset.listid + '].visible'
						console.log(e.currentTarget.dataset.listid, visibleChange)
						that.setData({
							[visibleChange]: 1
						})
						// let session = wx.getStorageSync('session')
						// wx.request({
						// 	url: app.globalData.publicPath + '/api/v1/bills/public/' + e.currentTarget.dataset.id + '/',
						// 	method: 'PUT',
						// 	data: {
						// 		isSettled: true
						// 	},
						// 	header: {
						// 		'3rd-session': session
						// 	},
						// 	success: res => {
						// 	}
						// })
					}
				}
			}
		})
	}
})