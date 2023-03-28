import request from "../utils/request"
export function upload(params: object) {
    return request({
      url: '/File/upload',
      method: 'post',
      params
    })
  }

  export function DocumentListAPI(params: object) {
    return request({
      url: '/File/DocumentList',
      method: 'get',
      params
    })
  }

  export function DocumentDownAPI(params: object) {
    return request({
      url: '/File/download',
      method: 'get',
      params
    })
  }

  