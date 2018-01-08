const app = getApp()
Page({
	data: {
		sort: {
			images: [
				{ imageUrl: '../../images/sort_select/food_yes.png', title: '餐饮', imageSpecial: 'imageSpecial'},
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
		summaryValue: '',
		summaryPlaceHolder: '餐饮',
		menuIndex: 0,
		uploadUrl: '../../images/picture_upload.png',
		time: '',
		moneyValue: null,
		remarkValue: '',
		host: {
			hostUrl: null,
			hostId: 0,
			hostIndex: -1,
		},
		guest: {
			guestInfo: [],
			guestIndex: [],
			guestId: []
		},
		remarkfocus: false,
		moneyfocus: false,
		groupNone: '',
		checked: true
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
	getSummary: function (e) {
		this.setData({
			summaryValue: e.detail.value
		})
	},
	// 选择账本类型
	changeSort: function (e) {
		console.log(e.currentTarget.dataset.menuindex)
		var that = this
		var url, special, sort = {}, index = e.currentTarget.dataset.menuindex
		that.setData({
			menuIndex: index,
			summaryPlaceHolder: that.data.sort.images[index].title
		})
		// 账单选择类型复原
		for (var i = 0; i < 7; i++) {
			url = 'sort.images[' + i + '].imageUrl'
			special = 'sort.images[' + i + '].imageSpecial'
			sort[url] = that.data.sort.imageUnSelect[i]
			sort[special] = ''
			if (i == index) {
				console.log(i)
				sort[url] = that.data.sort.imageSelect[i]
				sort[special] = 'imageSpecial'
			}
			that.setData(sort)
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
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePaths = res.tempFilePaths[0]
				that.setData({
					uploadUrl: tempFilePaths
				})
			}
		})
	},
	listenerSwitch: function (e) {
		if (e.detail.value) {
			this.setData({
				checked: true,
				groupNone: ''
			})
		} else {
			this.setData({
				checked: false,
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
	// 完成表单按钮
	finishForm: function () {
		var that = this
		if (!that.data.uploadUrl.match('../images/')) {
			wx.uploadFile({
				url: app.globalData.publicPath + "/api/v1/images/bills/",
				method: 'POST',
				filePath: that.data.uploadUrl,
				name: 'bill',
				header: {
					"Content-Type": "multipart/form-data"
				},
				formData: {
					'bill': that.data.uploadUrl
				},
				success: res => {
					if (res.statusCode == 200 || res.statusCode == 201) {
						wx.showToast({
							title: '上传成功',
						})
					}
					that.setData({
						uploadUrl: app.globalData.publicPath + '/' + JSON.parse(res.data).path
					})
					if (!that.data.summaryValue) {
						that.setData({
							summaryValue: that.data.summaryPlaceHolder
						})
						console.log(that.data.summaryValue)
					}
					console.log(that.data.uploadUrl)
					if (!that.data.checked) {
						console.log('这是一笔私账')
						that.requestPrivate(that.data.uploadUrl)
					} else {
						console.log('这是一笔公账')
						that.requestPublic(that.data.uploadUrl)
					}
				},
				fail: e => {
					console.log(e)
				}
			})
		} else {
			console.log('没有图片上传！')
			if (!that.data.checked) {
				console.log('这是一笔私账')
				that.requestPrivate('')
			} else {
				console.log('这是一笔公账')
				that.requestPublic('')
			}
		}
	}, 
	requestPublic: function (image) {
		let that = this
		let check = that.checkInfo()
		if (check) {
			console.log(check)
			wx.request({
				url: app.globalData.publicPath + '/api/v1/account_books/' + app.globalData.accountbookId + '/bills/public/',
				method: 'POST',
				data: {
					"category": that.data.sort.images[that.data.menuIndex].title,
					"image": image,
					"note": that.data.remarkValue,
					"participants": that.data.guest.guestId,
					"payerId": that.data.host.hostId,
					"summary": !that.data.summaryValue ? that.data.summaryPlaceHolder : that.data.summaryValue,
					"sum": that.checkSum(that.data.moneyValue),
					"time": that.data.time
				},
				header: {
					'Content-Type': 'application/json',
					'3rd-session': wx.getStorageSync('session')
				},
				success: res => {
					console.log('success:', res)
					wx.showToast({
						title: '上传成功',
					})
					setTimeout(function () {
						wx.navigateBack({
							delta: 1
						})
					}, 1000)
				},
				fail: res => {
					wx.showModal({
						title: '提示',
						content: '账单上传失败，请重新上传！',
						confirmColor: '#39a6ff',
						showCancel: false
					})
				}
			})
		} else {
			return
		}
	},
	requestPrivate: function (image) {
		let that = this
		let check = that.checkInfo()
		if (check) {
			console.log(check)
			wx.request({
				url: app.globalData.publicPath + '/api/v1/account_books/' + app.globalData.accountbookId + '/bills/private/',
				method: 'POST',
				data: {
					"category": that.data.sort.images[that.data.menuIndex].title,
					"summary": that.data.summaryValue,
					"image": image,
					"payerId": app.globalData.id,
					"note": that.data.remarkValue,
					"sum": that.checkSum(that.data.moneyValue),
					"time": that.data.time
				},
				header: {
					'Content-Type': 'application/json',
					'3rd-session': wx.getStorageSync('session')
				},
				success: res => {
					console.log('success:', res)
					wx.showToast({
						title: '上传成功！',
					})
					setTimeout(function () {
						wx.navigateBack({
							delta: 1
						})
					}, 1000)
				},
				fail: res => {
					wx.showModal({
						title: '提示',
						content: '账单上传失败，请重新上传！',
						confirmColor: '#39a6ff',
						showCancel: false
					})
				}
			})
		} else {
			return
		}
	},
	checkInfo: function (checked) {
		if (!this.data.moneyValue) {
			wx.showModal({
				title: '提示',
				content: '您还未输入金额',
				confirmColor: '#39a6ff',
				showCancel: false
			})
			return 0
		} else if (this.data.checked) {
			console.log(this.data.host, this.data.guest)
			if (this.data.host.hostIndex == -1) {
				wx.showModal({
					title: '提示',
					content: '您还未选择付款人',
					confirmColor: '#39a6ff',
					showCancel: false
				})
				return 0
			} else if (!this.data.guest.guestId || this.data.guest.guestId.length == 0) {
				wx.showModal({
					title: '提示',
					content: '您还未选择参与者',
					confirmColor: '#39a6ff',
					showCancel: false
				})
				return 0
			} else {
				return 1
			}
		} else {
			return 1
		}
	},
	checkSum: function (sum) {
		if (!sum || isNaN(sum)) {
			return 0
		} else {
			return sum * 100
		}
	},
	// 清除表单数据
	deleteForm: function () {
		let that = this
		wx.showModal({
			title: '提示',
			content: '是否删除当前账单?',
			confirmColor: '#39a6ff',
			success: res => {
				if (res.confirm) {
					that.resetForm()
				} else {
					return
				}
			}
		})
	},
	resetForm: function () {
		var that = this
		var url, special, sort = {}
		// 账单选择类型复原
		for (var i = 0; i < 7; i++) {
			url = 'sort.images[' + i + '].imageUrl'
			special = 'sort.images[' + i + '].imageSpecial'
			sort[url] = that.data.sort.imageUnSelect[i]
			sort[special] = ''
			if (i == 0) {
				sort[url] = '../../images/sort_select/food_yes.png'
				sort[special] = 'imageSpecial'
			}
			that.setData(sort)
		}
		that.setData({
			summaryValue: '',
			menuIndex: 0,
			uploadUrl: '../../images/picture_upload.png',
			time: this.getCurrentTime(),
			hostUrl: '',
			hostName: '',
			hostIndex: -1,
			remarkValue: '',
			moneyValue: null,
			guestInfo: [],
			remarkfocus: false,
			moneyfocus: false,
			groupNone: '',
			checked: true
		})
		console.log(this.data)
	}
})
