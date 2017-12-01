const app = getApp()

Page({
	data: {
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
		moneyValue: '',
		remarkValue: '',
		hostUrl: [],
		hostName: '',
		hostIndex: -1,
		guestInfo: [],
		remarkfocus: false,
		moneyfocus: false,
		groupNone: 'groupNone',
		checked: false
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
	getmoneyValue: function (e) {
		this.setData({
			moneyValue: e.detail.value
		})
	},
	getremarkValue: function (e) {
	this.setData({
		remarkValue: e.detail.value
	})
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
	// 图片选择
	codeUpload: function () {
		var _this = this
		wx.showActionSheet({
			itemList: ['从相册中选择', '拍照'],
			itemColor: "#000000",
			success: function (res) {
				if (!res.cancel) {
					if (res.tapIndex == 0) {
						_this.chooseWxImage('album')
					} else if (res.tapIndex == 1) {
						_this.chooseWxImage('camera')
					}
				}
			}
		})
	},
	chooseWxImage: function (type) {
		var that = this
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePaths = res.tempFilePaths
				console.log(tempFilePaths[0])
				that.setData({
					uploadUrl: tempFilePaths[0]
				})
			}
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
	},
	payerChoose: function () {
		wx.navigateTo({
			url: '../payerSelect/payerSelect'
		})
	},
	payeeChoose: function () {
		wx.navigateTo({
			url: '../payeeSelect/payeeSelect'
		})
	},
	finishForm: function () {
		var form = {}
	},
	// 清除表单数据
	deleteForm: function () {
		var that = this
		var url, special, sort = {}
		for (var i = 0; i < 7; i++) {
			url = 'sort.images[' + i + '].imageUrl'
			special = 'sort.images[' + i + '].imageSpecial'
			sort[url] = that.data.sort.imageUnSelect[i]
			sort[special] = ''
			that.setData(sort)
		}
		console.log(this.data.remarkValue, this.data.moneyValue)
		that.setData({
			uploadUrl: '../../images/picture_upload.png',
			time: this.getCurrentTime(),
			hostUrl: [],
			hostName: '',
			hostIndex: -1,
			remarkValue: '',
			moneyValue: '',
			guestInfo: [],
			remarkfocus: false,
			moneyfocus: false,
			groupNone: 'groupNone',
			checked: false
		})
		console.log(that.data.sort)
	}
})
