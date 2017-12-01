const app = getApp()

Page({
	data: {
		payers: [
			{
				userImage: '',
				userName: '麻雀处处飞1',
				checkUrl: '../../images/member_no.png',
				checkBool: true
			},
			{
				userImage: '',
				userName: '麻雀处处飞2',
				checkUrl: '../../images/member_no.png',
				checkBool: false
			},
			{
				userImage: '',
				userName: '麻雀处处飞3',
				checkUrl: '../../images/member_no.png',
				checkBool: false
			}
		],
		index: 0
	},
	onShow: function () {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 2]
		this.checkedFunc(prevPage.data.hostIndex)
	},
	checkStatus: function (e) {
		var i = e.currentTarget.dataset.id
		console.log(i)
		this.setData({
			index: e.currentTarget.dataset.id
		})
		this.checkedFunc(i)
	},
	backButton: function () {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 2]
		let hostArr = []
		hostArr.push(this.data.payers[this.data.index].userImage)
		let hostName = this.data.payers[this.data.index].userName
		prevPage.setData({
			hostUrl: hostArr,
			hostName: hostName,
			hostIndex: this.data.index
		})
		wx.navigateBack({
			delta: 1
		})
	},
	checkedFunc: function (i) {
		for (var j = 0; j < this.data.payers.length; j++) {
			if (j == i) {
				this.data.payers[j].checkUrl = '../../images/member_yes.png'
				this.data.payers[j].checkBool = true
				this.setData({
					payers: this.data.payers
				})
			} else {
				this.data.payers[j].checkUrl = '../../images/member_no.png'
				this.data.payers[j].checkBool = false
				this.setData({
					payers: this.data.payers
				})
			}
		}
	}
})
