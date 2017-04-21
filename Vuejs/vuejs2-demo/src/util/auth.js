/* globals sessionStorage */
// sessionStorage  我们要用sessionStorage  安全点
export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (sessionStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    pretendRequest(email, pass, (res) => {
      if (res.authenticated) {
        sessionStorage.token = res.token
        if (cb) cb(res.authenticated)
        this.onChange(res.authenticated)
      } else {
        if (cb) cb(res.authenticated)
        this.onChange(res.authenticated)
      }
    })
  },

  getToken () {
    return sessionStorage.token
  },

  logout (cb) {
    delete sessionStorage.token
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    console.log("获取本地存储里的seesionStorsge,来判断登陆状态")
    return !!sessionStorage.token
  },

  onChange (_is) {
    console.log("login-onChange")
  }
}

// mock请求 暂时不引入vue－resource todo
function pretendRequest (email, pass, cb) {
  setTimeout(() => {
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }
  }, 0)
}
