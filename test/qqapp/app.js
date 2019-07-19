//app.js
import ui from './app/ui'
import share from './app/share'
const events = require('./utils/event_dispatcher')
import api from './http/api'

App({
  onLaunch: function () {
    //挂载Ui管理器
    qq.ui = ui
    //挂载分享管理器
    qq.share = share
    //挂载全局消息通知
    qq.events = events
    //挂载全局api服务
    qq.api = api
    //挂载打印信息
    qq.log = function (...log) {
      console.log(log)
    }
    //挂载消息提示
    qq.toast = function (msg, icon = 'none') {
      qq.showToast({
        title: msg,
        icon: icon,
        duration: 1500,
      });
    }
    // 获取用户信息
    qq.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          qq.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.setUserInfo(res.userInfo)
            },
            fail: error => {
              this.setUserInfo(null)
            }
          })
        }else{
          this.setUserInfo(null)
        }
      }
    })
    qq.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    })
  },
  globalData: {
    userInfo: null,
    statusBarHeight: 0
  },
  setUserInfo(info) {
    if (info) { //进行用户登录
      qq.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            // 发起登录的网络请求获取用户信息
            // console.log(res.code)
            qq.api.userService.loginByQQmini(res.code,info)
              .then(data => {
                this.setCurrentUserInfo(info)
              }).catch(error=>{
                // console.log(error)
                // qq.toast("登录失败，请重试！")
                this.setCurrentUserInfo(null)
              })
          } else {
            // qq.toast("登录失败，请重试！")
            this.setCurrentUserInfo(null)
          }
        }
      })
    } else {
      this.setCurrentUserInfo(null)
    }
  },
  //设置当前的用户信息
  setCurrentUserInfo(info) {
    //设置用户信息
    this.globalData.userInfo = info
    //没有用户信息退出登录
    if(info==null){
      qq.api.userService.logout()
    }
    // 发送全局通知
    qq.events.post(qq.events.msgs.user_info, info)
  }
})