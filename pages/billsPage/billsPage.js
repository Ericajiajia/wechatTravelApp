const app = getApp()

Page({
	data: {
		bills: [
			{
				location: '上海',
				time: '2017-01-23',
				id: '123',
				txtStyle: ''
			},
			{
				location: '杭州',
				time: '2017-01-01',
				id: '456',
				txtStyle: ''
			},
			{
				location: '苏州',
				time: '2017-06-14',
				id: '789',
				txtStyle: ''
			},
			{
				location: '海南',
				time: '2017-07-05',
				id: '3223',
				txtStyle: ''
			},
			{
				location: '福州',
				time: '2017-02-27',
				id: '65446',
				txtStyle: ''
			},
			{
				location: '北京',
				time: '2017-04-19',
				id: '54',
				txtStyle: ''
			},
			{
				location: '海南',
				time: '2017-07-05',
				id: '545',
				txtStyle: ''
			},
			{
				location: '福州',
				time: '2017-02-27',
				id: '656',
				txtStyle: ''
			},
			{
				location: '北京',
				time: '2017-04-19',
				id: '876',
				txtStyle: ''
			},
			{
				location: '海南',
				time: '2017-07-05',
				id: '732',
				txtStyle: ''
			},
			{
				location: '福州',
				time: '2017-02-27',
				id: '7658',
				txtStyle: ''
			},
			{
				location: '北京',
				time: '2017-04-19',
				id: '97678',
				txtStyle: ''
			}
		],
		height: 0,
		scrollY: true
	},
	swipeCheckX: 35, //激活检测滑动的阈值
	swipeCheckState: 0, //0未激活 1激活
	maxMoveLeft: 160, //消息列表项最大左滑距离
	correctMoveLeft: 150, //显示菜单时的左滑距离
	thresholdMoveLeft: 50,//左滑阈值，超过则显示菜单
	lastShowMsgId: '', //记录上次显示菜单的消息id
	moveX: 0,  //记录平移距离
	showState: 0, //0 未显示菜单 1显示菜单
	touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
	swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
	onLoad: function () {
		var windowHeight = app.data.deviceInfo.windowHeight
		var height = windowHeight
		this.setData({height: height})
	},
	touchStart: function (e) {
		if (this.showState === 1) {
			this.touchStartState = 1
			this.showState = 0
			this.moveX = 0
			this.translateXMsgItem(this.lastShowMsgId, 0, 200)
			this.lastShowMsgId = ""
			return
		}
		this.firstTouchX = e.touches[0].clientX
		this.firstTouchY = e.touches[0].clientY
		if (this.firstTouchX > this.swipeCheckX) {
			this.swipeCheckState = 1
		}
	},
	touchMove: function (e) {
		if (this.swipeCheckState === 0) {
			return
		}
		//当开始触摸时有菜单显示时，不处理滑动操作
		if (this.touchStartState === 1) {
			return
		}
		var moveX = e.touches[0].clientX - this.firstTouchX
		var moveY = e.touches[0].clientY - this.firstTouchY
		//已触发垂直滑动，由scroll-view处理滑动操作
		if (this.swipeDirection === 2) {
			return
		}
		//未触发滑动方向
		if (this.swipeDirection === 0) {
			//触发垂直操作
			if (Math.abs(moveY) > 4) {
				this.swipeDirection = 2
				return
			}
			//触发水平操作
			if (Math.abs(moveX) > 4) {
				this.swipeDirection = 1
				this.setData({ scrollY: false })
			}
			else {
				return
			}

		}
		//处理边界情况
		if (moveX > 0) {
			moveX = 0
		}
		//检测最大左滑距离
		if (moveX < -this.maxMoveLeft) {
			moveX = -this.maxMoveLeft
		}
		this.moveX = moveX
		this.translateXMsgItem(e.currentTarget.id, moveX, 0)
	},
	touchEnd: function (e) {
		this.swipeCheckState = 0
		var swipeDirection = this.swipeDirection
		this.swipeDirection = 0
		if (this.touchStartState === 1) {
			this.touchStartState = 0
			this.setData({ scrollY: true })
			return
		}
		//垂直滚动，忽略
		if (swipeDirection !== 1) {
			return
		}
		if (this.moveX === 0) {
			this.showState = 0
			//不显示菜单状态下,激活垂直滚动
			this.setData({ scrollY: true })
			return
		}
		if (this.moveX === this.correctMoveLeft) {
			this.showState = 1
			this.lastShowMsgId = e.currentTarget.id
			return
		}
		if (this.moveX < -this.thresholdMoveLeft) {
			this.moveX = -this.correctMoveLeft
			this.showState = 1
			this.lastShowMsgId = e.currentTarget.id
		}
		else {
			this.moveX = 0
			this.showState = 0
			//不显示菜单,激活垂直滚动
			this.setData({ scrollY: true })
		}
		this.translateXMsgItem(e.currentTarget.id, this.moveX, 350)
	}, 
	// 根据id号获取当前点击账单索引值
	getItemIndex: function (id) {
		var bills = this.data.bills
		for (var i = 0; i < bills.length; i++) {
			if (bills[i].id === id) {
				return i
			}
		}
		return -1
	},
	translateXMsgItem: function (id, x, duration) {
		var animation = wx.createAnimation({ duration: duration })
		animation.translateX(x).step()
		this.animationMsgItem(id, animation)
	},
	animationMsgItem: function (id, animation) {
		var index = this.getItemIndex(id)
		var param = {}
		var indexString = 'bills[' + index + '].animation'
		param[indexString] = animation.export()
		this.setData(param)
	},
	animationMsgWrapItem: function (id, animation) {
		var index = this.getItemIndex(id)
		var param = {}
		var indexString = 'bills[' + index + '].wrapAnimation'
		param[indexString] = animation.export()
		this.setData(param)
	},
	// 删除账单
	billDelete: function (e) {
		var animation = wx.createAnimation({ duration: 200 });
		animation.height(0).opacity(0).step();
		this.animationMsgWrapItem(e.currentTarget.id, animation);
		var s = this;
		setTimeout(function () {
			var index = s.getItemIndex(e.currentTarget.id);
			s.data.bills.splice(index, 1);
			s.setData({ bills: s.data.bills });
		}, 200);
		this.showState = 0;
		this.setData({ scrollY: true })
	},
	changeBill: function (e) {
		var pages = getCurrentPages()
		var prevPage = pages[pages.length - 2]
		prevPage.setData({
			title: {
				location: e.currentTarget.dataset.location,
				time: e.currentTarget.dataset.time
			},
			accountId: e.currentTarget.id
		})
		wx.navigateBack({
			delta: 1
		})
	}
})
