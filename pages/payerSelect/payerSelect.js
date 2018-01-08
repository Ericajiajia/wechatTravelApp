const app = getApp()

Page({
	data: {
		title: {
			location: '',
			time: ''
		},
		payers: [
		],
		index: [],
		payersId: []
	},
	onShow: function () {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 3]
		var lastPage = pages[pages.length - 2]
		console.log(lastPage.data.guest)
		let payersArr = this.getUsers(app.globalData.users)
		this.setData({
			title: {
				location: prevPage.data.title.location,
				time: prevPage.data.title.time
			},
			payers: payersArr,
			index: lastPage.data.guest.guestIndex
		})
		this.checkedFunc(lastPage.data.guest.guestIndex)
	},
	getUsers: function (data) {
		if (!data || data.length == 0) {
			return [{
				userImage: app.globalData.avatarUrl,
				userName: app.globalData.nickName,
				userId: app.globalData.id,
				checkUrl: '../../images/member_yes.png',
				checkBool: true
			}]
		} else {
			let dataPer = {}, dataArr = []
			for (let i = 0; i < data.length; i ++) {
				dataPer.userImage = app.globalData.users[i].avatarUrl
				dataPer.userName = app.globalData.users[i].nickName
				dataPer.userId = app.globalData.id
				dataPer.checkUrl = '../../images/member_yes.png'
				dataPer.checkBool = true
				dataArr.push(dataPer)
			}
			console.log(dataArr)
			return dataArr
		}
	},
	checkStatus: function (e) {
		var i = e.currentTarget.dataset.index
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
	checkedFunc: function (arr) {
		let that = this
		if (!arr || arr.length == 0) {
			return
		} else {
			for (let i = 0; i < arr.length; i ++) {
				that.data.payers[arr[i]].checkUrl = '../../images/member_yes.png',
				that.data.payers[arr[i]].checkBool = true
			}
			that.setData({
				payers: that.data.payers
			})
		}
	},
	// 这里可以进行反选，所以最后会出现全部清空的状况
	payerChoose: function () {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 2]
		let that = this
		let guestObjectArr = [], indexArr = [], idArr = []
		for (let j = 0; j < that.data.payers.length; j++) {
			let guestObject = {}
			if (that.data.payers[j].checkBool) {
				guestObject.imageUrl = that.data.payers[j].userImage
				guestObject.userName = that.data.payers[j].userName
				guestObject.userId = that.data.payers[j].userId
				guestObjectArr.push(guestObject)
				idArr.push({"id": guestObject.userId})
				indexArr.push(j)
			}
		}
		console.log(guestObjectArr, indexArr, idArr)
		if (!indexArr || indexArr.length == 0) {
			wx.showModal({
				title: '提示',
				content: '您还未选择参与人！', 
				confirmText: '我知道了',
				confirmColor: '#39a6ff',
				showCancel: false
			})
		} else {
			prevPage.setData({
				guest: {
					guestInfo: guestObjectArr,
					guestIndex: indexArr,
					guestId: idArr
				}
			})
			console.log(prevPage.data.guest)
			setTimeout(function () {
				wx.navigateBack({
					delta: 1
				})
			}, 200)
		}
	},
	onShareAppMessage: function (res) {
		let that = this
		if (res.from === 'button') {
			return {
				title: app.globalData.nickName + '邀请你加入' + that.data.title.location + '(' + that.data.title.time + ')',
				path: 'pages/addToAccount/addToAccount'
			}
		} 
	}
})
