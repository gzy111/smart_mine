import request from "../utils/request"
export function upload(params: object) {
    return request({
      url: '/File/upload',
      method: 'post',
      params
    })
  }