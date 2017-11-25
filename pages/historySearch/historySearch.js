const app = getApp()

Page({
  data: {
    historyList: [{
      imageUrl: '',
      name: '佳佳',
      done: '增加',
      sort: '餐饮',
      price: '324.5'
    }, {
        imageUrl: '',
        name: '佳佳133',
        done: '删除',
        sort: '餐饮',
        price: '43'
    }, {
        imageUrl: '',
        name: '佳佳6776',
        done: '删除',
        sort: '餐饮',
        price: '76456.9'
    }, {
        imageUrl: '',
        name: '不会叫',
        done: '增加',
        sort: '餐饮',
        price: '876.54'
    }],
    have: 'have',
    none: ''
  },
  onLoad: function () {
    // 判断当前页面是否有数据需要渲染
    if (this.data.historyList.length == 0) {
      this.setData({
        none: '',
        have: 'have'
      })
    } else {
      this.setData({
        none: 'none',
        have: ''
      })
    }
  }
})