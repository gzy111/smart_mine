import request from "../utils/request"

export function PostSelectAllAPI(params: object) {
  return request({
    url: '/Post/SelectAll',
    method: 'get',
    params
  })
}


export function PostSelectAPI(params: object) {
  return request({
    url: '/Post/SelectPageAll',
    method: 'get',
    params
  })
}