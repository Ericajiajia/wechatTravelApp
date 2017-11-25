const app = getApp()

Page({
  data: {
    infoUrl: '../../images/more_info.png',
    iconUrl: '../../images/picture_upload.png',
    infoTitle: '上传你的收款二维码便于小伙伴支付哦',
    show0: 'show0',
    upload: false
  },
  // onLoad: function () {
  //   wx.getUserInfo({
  //     success: res => {
  //       app.globalData.userInfo = res.userInfo
  //       this.setData({
  //         userInfo: res.userInfo
  //       })
  //       console.log(this.data.userInfo.nickName)
  //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //       // 所以此处加入 callback 以防止这种情况
  //       if (app.userInfoReadyCallback) {
  //         app.userInfoReadyCallback = res => {
  //           this.setData({
  //             userInfo: res.userInfo
  //           })
  //         }
  //       }
  //     }
  //   })
  // },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo
  //   })
  // },
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
    this.setData({
      infoTitle: '点击二维码更改',
      upload: true
    })
  }
})