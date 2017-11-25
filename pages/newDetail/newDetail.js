const app = getApp()

Page({
	data: {
		indexNumber: 3,
		sort: {
			images: [
				{ imageUrl: '../../images/sort_select/food_no.png', title: '餐饮', imageSpecial: ''},
				{ imageUrl: '../../images/sort_select/bus_no.png', title: '交通', imageSpecial: ''},
				{ imageUrl: '../../images/sort_select/hotel_no.png', title: '住宿', imageSpecial: ''},
				{ imageUrl: '../../images/sort_select/shopping_no.png', title: '购物', imageSpecial: ''},
				{ imageUrl: '../../images/sort_select/ticket_no.png', title: '订票', imageSpecial: ''},
				{ imageUrl: '../../images/sort_select/play_no.png', title: '娱乐', imageSpecial: ''},
				{ imageUrl: '../../images/sort_select/other_no.png', title: '其他', imageSpecial: ''},
			],
			imageUnSelect: [
				'../../images/sort_select/food_no.png',
				'../../images/sort_select/bus_no.png',
				'../../images/sort_select/hotel_no.png',
				'../../images/sort_select/shopping_no.png',
				'../../images/sort_select/ticket_no.png',
				'../../images/sort_select/play_no.png',
				'../../images/sort_select/other_no.png'
			],
			imageSelect: [
				'../../images/sort_select/food_yes.png',
				'../../images/sort_select/bus_yes.png',
				'../../images/sort_select/hotel_yes.png',
				'../../images/sort_select/shopping_yes.png',
				'../../images/sort_select/ticket_yes.png',
				'../../images/sort_select/play_yes.png',
				'../../images/sort_select/other_yes.png'
			]
		},
		uploadUrl: '../../images/picture_upload.png',
		time: '',
		guestUrl: ['', '', '', '', ''],
		remarkfocus: false,
		moneyfocus: false,
		groupNone: 'groupNone'
	},
	onLoad: function () {
		this.setData({
			time: this.getCurrentTime()
		})
		console.log(this.getCurrentTime())
	},
	getCurrentTime: function () {
		var time = new Date()
		var year = time.getFullYear()
		var month = time.getMonth() + 1
		var date = time.getDate()
		return year + '-' + month + '-' + date
	},
	// 选择账本类型
	changeSort: function (e) {
		console.log(this.data.sort.images.length)
		var that = this
		var url, special, sort = {}
		for (var i = 0; i < 7; i ++) {
			url = 'sort.images[' + i + '].imageUrl'
			special = 'sort.images[' + i + '].imageSpecial'
			if (i == e.currentTarget.dataset.menuindex) {
				console.log(i)
				sort[url] = that.data.sort.imageSelect[i]
				sort[special] = 'imageSpecial'
				that.setData(sort)
			} else {
				sort[url] = that.data.sort.imageUnSelect[i]
				sort[special] = ''
				that.setData(sort)
			}
		}
	},
	// 时间选择
	bindDateChange: function (e) {
		console.log(e.detail.value)
		this.setData({
			time: e.detail.value
		})
	},
	remarkFocus: function () {
		this.setData({
			remarkfocus: true
		})
	},
	moneyFocus: function () {
		this.setData({
			moneyfocus: true
		})
	},
	listenerSwitch: function (e) {
		if (e.detail.value) {
			this.setData({
				groupNone: ''
			})
		} else {
			this.setData({
				groupNone: 'groupNone'
			})
		}
	}
})
