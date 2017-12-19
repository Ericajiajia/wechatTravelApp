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
				sort: '餐饮',
				time: '今天',
				price: '562.2',
				done: '结清',
				doneStyle: 'undone'
			},
			{
				imageUrl: '../../images/sort_select/hotel_yes.png',
				sort: '餐饮',
				time: '今天',
				price: '562.2',
				done: '已结清',
				doneStyle: 'done'
			},
			{
				imageUrl: '../../images/sort_select/other_yes.png',
				sort: '餐饮',
				time: '2014-12-31',
				price: '562.2',
				done: '结清',
				doneStyle: 'undone'
			}
			],
		detailShow2: [],
		noneArray: ['暂无公账记录', '暂无私账记录'],
		bill: {
			noneContent: '暂无公账记录',
			billNone: 'billNone',
			billHave: '',
			detailShow: []
		},
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
		visible: '',
		accountId: '23'
	},
	onShareAppMessage: function () {
		return {
			title: '旅行记账',
			desc: '邀请您加入账本',
			path: '/pages/accountDetail/accountDetail'
		}
	},
	onShow: function () {
		const that = this
		// 检查是否有队友
		wx.request({
			url: app.globalData.publicPath + '/api/v1/account_books/' + app.globalData.accountbookId + '/',
			method: 'GET',
			success: res => {
				// 得到我的总花费
				let sum = that.getSummoney(res.data)
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
		for (let i = 0; i < data.publicBills.length; i ++) {
			detailPer = {}
			if (data.publicBills[i] == {}) {
				continue
			}
			detailPer.imageUrl = this.getImageUrl(data.publicBills[i].category)
			detailPer.sort = data.publicBills[i].category
			detailPer.price = data.publicBills[i].sum
			detailPer.time = this.getTime(data.publicBills[i].time)
			if (data.publicBills[i].isSettled) {
				detailPer.done = '已结清'
				detailPer.doneStyle = 'done'
			} else {
				detailPer.done = '结清'
				detailPer.doneStyle = 'undone'
			}
			detailShow1.push(detailPer)
		}
		for (let i = 0; i < data.privateBills.length; i++) {
			detailPer = {}
			if (data.privateBills[i] == {} || !data.privateBills[i].category) {
				continue
			}
			console.log(data.privateBills[i])
			detailPer.imageUrl = this.getImageUrl(data.privateBills[i].category)
			detailPer.sort = data.privateBills[i].category
			detailPer.price = data.privateBills[i].sum
			detailPer.time = this.getTime(data.privateBills[i].time)
			detailShow2.push(detailPer)
		}
		this.setData({
			detailShow1: detailShow1,
			detailShow2: detailShow2
		})
	},
	getImageUrl: function (cate) {
		var that = this
		for (let i = 0; i < that.data.imageList.length; i ++) {
			if (cate == that.data.imageList[i]) {
				return that.data.imageSelect[i]
			}
		}
	},
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
		for (let i = 0; i < data.privateBills.length; i++) {
			if (!data.privateBills[i].sum || data.privateBills[i].sum == '') {
				data.privateBills[i].sum = 0
			}
			sum += data.privateBills[i].sum
		}
		for (let i = 0; i < data.publicBills.length; i++) {
			if (!data.publicBills[i].sum || data.publicBills[i].sum == '') {
				data.publicBills[i].sum = 0
			}
			sum += data.publicBills[i].sum / (data.publicBills[i].participants.length + 1)
		}
		sum = (sum / 100).toFixed(2)
		return sum
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
	// 私账样式设计
	sortPrivate: function () {
		this.privateBill()
	},
	publicBill: function () {
		this.setData({
			sort: {
				selected1: 'selected1',
				selected2: ''
			},
			visible: ''
		})
		if (this.data.detailShow1.length) {
			this.setData({
				bill: {
					billNone: 'billNone',
					billHave: '',
					detailShow: this.data.detailShow1
				}
			})
		} else {
			this.setData({
				bill: {
					billNone: '',
					billHave: 'billHave',
					noneContent: this.data.noneArray[0]
				}
			})
		}
	},
	privateBill: function () {
		this.setData({
			sort: {
				selected1: '',
				selected2: 'selected2'
			},
			visible: 'visible'
		})
		if (this.data.detailShow2.length) {
			this.setData({
				bill: {
					billNone: 'billNone',
					billHave: '',
					detailShow: this.data.detailShow2
				}
			})
		} else {
			this.setData({
				bill: {
					billNone: '',
					billHave: 'billHave',
					noneContent: this.data.noneArray[1]
				}
			})
		}
	}
})