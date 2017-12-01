import Watch from '../../libs/watch'
const app = getApp()
let watch
Page({
	data: {
		title: {
			location: '上海',
			time: '2017-11-22',
			users: []
		},
		textNone: 'textNone',
		summoney: {
			money: '3200.00' 
		},
		sort: {
			selected1: 'selected1',
			selected2: ''
		},
		detailShow1: [],
		detailShow2: [
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
				time: '今天',
				price: '562.2',
				done: '结清',
				doneStyle: 'undone'
			}
		],
		noneArray: ['暂无公账记录', '暂无私账记录'],
		bill: {
			noneContent: '暂无公账记录',
			billNone: 'billNone',
			billHave: '',
			detailShow: []
		},
		show0: 'show0',
		show1: 'show1',
		accountId: '23'
	},
	watch: {
		'title.users': function (val, oldVal) {
			console.log(1)
			if (val.length) {
				this.setData({
					textNone: 'textNone'
				})
			} else {
				this.setData({
					textNone: ''
				})
			}
		}
	},
	onLoad: function () {
		watch = new Watch(this);
		// 初始显示公账详情
		this.publicBill()
		// 检查是否有队友
		if (this.data.title.users.length) {
			this.setData({
				textNone: 'textNone'
			})
		} else {
			this.setData({
				textNone: ''
			})
		}
	},
	// 添加队友
	addUser: function () {
		watch.setData({
			'title.users': ['', '', '']
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
	// 菜单选项
	switchAccount: function () {
		wx.navigateTo({
			url: '../billsPage/billsPage'
		})
	},
	newAccount: function () {
		wx.navigateTo({
			url: '../newAccount/newAccount'
		})
	},
	showAccount: function () {
		wx.navigateTo({
			url: '../accountSummary/accountSummary'
		})
	},
	historyCheck: function () {
		wx.navigateTo({
			url: '../historySearch/historySearch'
		})
	},
	uploadCode: function () {
		wx.navigateTo({
			url: '../codeUpload/codeUpload'
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
			}
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
			}
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