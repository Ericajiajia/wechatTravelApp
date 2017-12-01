const app = getApp()

Page({
  data: {
    infoUrl: '../../images/more_info.png',
    iconUrl: '../../images/picture_upload.png',
    infoTitle: '上传你的收款二维码便于小伙伴支付哦',
    show0: 'show0',
    upload: false
  },
	onShow: function () {
		if (this.data.iconUrl.match('picture_upload')) {
			this.setData({
				upload: false,
				infoTitle: '上传你的收款二维码便于小伙伴支付哦'
			})
		}
		if (this.data.upload) {
			this.setData({
				infoTitle: '点击二维码更改'
			})
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
				var tempFilePaths = res.tempFilePaths
				console.log(tempFilePaths[0])
				that.setData({
					infoTitle: '点击二维码更改',
					upload: true,
					iconUrl: tempFilePaths[0]
				})
			}
		})
	},
	codeConfirm: function () {
		wx.navigateBack({
			delta: 1,
		})
	}
})