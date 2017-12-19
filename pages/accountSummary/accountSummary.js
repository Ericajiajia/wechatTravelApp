var wxCharts = require('../../libs/wxcharts-min.js')
const app = getApp()

Page({
	data: {
		user: {
			name: '麻雀处处飞',
			location: '上海'
		},
		summoney: 1299.8,
		detail: [
			{
				imageUrl: '../../images/sort_select/food_yes.png',
				variety: '餐饮',
				remark: '桃源村',
				money: 99.8
			},
			{
				imageUrl: '../../images/sort_select/food_yes.png',
				variety: '餐饮',
				remark: '超市购物',
				money: 80.57
			},
			{
				imageUrl: '../../images/sort_select/hotel_yes.png',
				variety: '住宿',
				remark: '7天连锁酒店，莫泰连锁酒店，湖南长沙',
				money: 256.0
			}
		]
	},
	onLoad: function () {
		this.ringChart()
		let sum = 0
		for (let j = 0; j < this.data.detail.length; j ++) {
			sum += this.data.detail[j].money
		}
		this.setData({
			summoney: sum
		})
	},
	ringChart: function () {
		new wxCharts({
			animation: true,
			canvasId: 'ringCanvas',
			type: 'ring',
			extra: {
				// ring曲线的宽度
				ringWidth: 35,
				pie: {
					// ring绘制的起始点
					offsetAngle: -30
				}
			},
			series: [{
				name: '住宿',
				data: 60,
				stroke: 'rgb(116, 184, 251)'
			}, {
				name: '餐饮',
				data: 20,
				stroke: 'rgb(247, 114, 117)'
			}, {
				name: '交通',
				data: 80,
				stroke: 'rgb(246, 157, 99)'
			}, {
					name: '其他',
				data: 40,
				stroke: 'rgb(171, 190, 246)'
			}, {
				name: '订票',
				data: 15,
				stroke: 'rgb(121, 205, 182)'
			}, {
				name: '娱乐',
				data: 45,
				stroke: 'rgb(214, 178, 51)'
			}, {
					name: '购物',
				data: 100,
				stroke: 'rgb(174, 213, 129)'
			}],
			disablePieStroke: true,
			width: 375,
			height: 310
		})
	},
	outputImage: function () {
		console.log('start screenshot')
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			canvasId: 'ringCanvas',
			success: function (res) {
				console.log(res.tempFilePath)
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function (res) {
							console.log('save successfully', res)
						},
						fail: function (res) {
							console.log(res)
							console.log('fail')
						}
					})
			}
		})
	}
})

