import request from "../utils/request"
export function login(params: object) {
    return request({
      url: '/login/login',
      method: 'post',
      params
    })
  }
  