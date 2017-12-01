const app = getApp()

Page({
	data: {
		payers: [
			{
				userImage: '',
				userName: '麻雀处飞',
				checkUrl: '../../images/member_no.png',
				checkBool: false
			},
			{
				userImage: '',
				userName: '处处飞',
				checkUrl: '../../images/member_no.png',
				checkBool: false
			},
			{
				userImage: '',
				userName: '麻雀处处飞',
				checkUrl: '../../images/member_no.png',
				checkBool: false
			}
		]
	},
	onShow: function () {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 2]
		console.log(prevPage.data.guestInfo)
		if (prevPage.data.guestInfo.length) {
			let guestInfo = prevPage.data.guestInfo
			let length = prevPage.data.guestInfo.length
			let payers = this.data.payers
			for (let j = 0; j < length; j ++) {
				payers[guestInfo[j].sortNumber].checkUrl = '../../images/member_yes.png'
				payers[guestInfo[j].sortNumber].checkBool = true
			}
			this.setData({
				payers: payers
			})
		}
	},
	checkStatus: function (e) {
		var i = e.currentTarget.dataset.id
		console.log(i)
		if (this.data.payers[i].checkBool) {
			this.data.payers[i].checkUrl = '../../images/member_no.png'
			this.data.payers[i].checkBool = false
			this.setData({
				payers: this.data.payers
			})
		} else {
			this.data.payers[i].checkUrl = '../../images/member_yes.png'
			this.data.payers[i].checkBool = true
			this.setData({
				payers: this.data.payers
			})
		}
	},
	payerChoose: function () {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 2]
		let guestObjectArr = []
		for (let j = 0; j < this.data.payers.length; j ++) {
			let guestObject = {}
			if (this.data.payers[j].checkBool) {
				guestObject.imageUrl = this.data.payers[j].userImage
				guestObject.userName = this.data.payers[j].userName
				guestObject.sortNumber = j
				console.log(guestObject)
				guestObjectArr.push(guestObject)
			}
		}
		prevPage.setData({
			guestInfo: guestObjectArr
		})
		wx.navigateBack({
			delta: 1
		})
	}
})
