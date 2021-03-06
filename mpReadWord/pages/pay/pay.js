// pages/settings/settings.js
const app = getApp();
const fetch = require('../../utils/fetch');

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        fetch.loginAndFetch("/products").then(res => {
            this.setData({items: res.data});
            if (options.vipExpired) {
                wx.showModal({
                    title: "购买时长",
                    content: "您的使用时间已经过期,请购买时长,谢谢!",
                    showCancel: false
                });
            }

        });
        fetch.loginAndFetch("/account").then(value => {
            this.setData({userInfo: value.data});
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {


    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onLoad({});
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    shareApp: function (res) {
        return this.onShareAppMessage(res);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        const me = this;
        return {
            title: '新新看图识字!',
            desc: '快和熊猫一起学习吧！',
            path: 'pages/index/index?sharedUserId=' + me.data.userInfo.id,
            imageUrl: '/assets/index.png',
            success:
                function (res) {
                    wx.showModal({
                        title: '本次分享结果:',
                        showCancel: false,
                        content: '分享成功,好友点击后您会获得5天的时长!',
                    })
                }

            ,
            fail: function (res) {
                console.log("转发失败!");
            }
        }
    },
    formSubmit: function (e) {
        let me = this;
        let formValues = e.detail.value;
        console.log('form发生了submit事件，携带数据为：', formValues);
        if (!formValues.productId) {
            wx.showModal({
                title: "购买时长",
                content: '请选择会员!',
                showCancel: false
            });
            return
        }
        let method = 'GET';
        let productName = '';
        for (let obj of me.data.items) {
            if (formValues.productId.toString() === obj.id.toString()) {
                productName = obj.name;
                break;
            }
        }
        let showMessage = productName + " 购买成功!";
        wx.login({
            success(res) {
                wx.showLoading({title: 'Loading...'});
                wx.request({
                    url: app.config.apiPay + "/" + formValues.productId,
                    method: method,
                    data: {
                        code: res.code,
                    },
                    success: function (res) {
                        console.log(res);
                        if (res && res.data && res.data.success) {
                            wx.requestPayment(
                                {
                                    timeStamp: res.data.timeStamp,
                                    nonceStr: res.data.nonceStr,
                                    package: res.data.package,
                                    signType: res.data.signType,
                                    paySign: res.data.paySign,
                                    success: function (res) {
                                        wx.showModal({
                                            title: "购买时长",
                                            content: showMessage,
                                            showCancel: false
                                        });
                                        wx.switchTab({
                                            url: '/pages/index/index'
                                        });
                                    },
                                    fail: function (res) {
                                        console.log("fail->", res)
                                    },
                                    complete: function (res) {
                                        console.log("complete->", res);
                                        console.log("complete errMsg->", res.errMsg);
                                        if (res.errMsg === 'requestPayment:ok') {
                                            wx.showModal({
                                                title: "购买时长",
                                                content: showMessage,
                                                showCancel: false
                                            });
                                            wx.switchTab({
                                                url: '/pages/index/index'
                                            });
                                        }

                                    }
                                });
                        }
                    }, fail: function (data) {
                        console.log(data);
                    }, complete: wx.hideLoading
                })
            }
        });


    }
});
