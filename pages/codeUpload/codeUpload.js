const app = getApp()
Page({
  data: {
    iconUrl: '../../images/picture_upload.png',
    show0: 'show0',
		codeInfo: '上传二维码',
    upload: false,
		forbidden: 'forbidden',
		infoShow: 0
  },
	onShow: function () {
		let that = this
		wx.request({
			url: app.globalData.publicPath + '/api/v1/users/' + app.globalData.id + '/',
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: res => {
				console.log('res:', res)
				if (!res.data.qrCode) {
					that.setData({
						codeInfo: '上传二维码',
						upload: false
					})
				} else {
					that.setData({
						codeInfo: '修改二维码',
						upload: true
					})
				}
			},
		})
	},
  changeInfo: function () {
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
				var tempFilePaths = res.tempFilePaths[0]
				that.setData({
					iconUrl: tempFilePaths
				})
				console.log(that.data.iconUrl)
			}
		})
	},
	uploadImage: function (url) {
		let that = this
		wx.uploadFile({
			url: app.globalData.publicPath + "/api/v1/images/qrcodes/",
			filePath: url,
			name: 'qrcode',
			header: {
				"Content-Type": "multipart/form-data"
			},
			formData: {
				'qrcode': url
			},
			success: res => {
				if (res.statusCode == 200) {
					console.log(res)
					that.setData({
						codeInfo: '修改二维码',
						upload: true,
						infoShow: 0,
					})
					wx.showToast({
						title: '上传成功',
						duration: 1000,
						success: res => {
							setTimeout(function () {
								wx.navigateBack({
									delta: 1
								})
							}, 1500)
						}
					})
				} else {
					that.setData({
						codeInfo: '修改二维码',
						upload: false,
						infoShow: 1,
					})
				}
				console.log(res)
			},
			fail: e => {
				console.log(e)
			}
		})
	},
	codeConfirm: function () {
		console.log(this.data.iconUrl)
		if (!this.data.iconUrl.match('../../images/picture_upload')) {
			this.uploadImage(this.data.iconUrl)
		} else {
			return
		}
	},
	showModal: function () {
		this.setData({
			show0: ''
		})
	},
	hideModal: function () {
		this.setData({
			show0: 'show0'
		})
	}
})