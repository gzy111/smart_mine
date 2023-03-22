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

export function PostInsetAPI(params: object) {
  return request({
    url: '/Post/InsertSelective',
    method: 'POST',
    params
  })
}

export function PostUpdateAPI(params: object) {
  return request({
    url: '/Post/UpdateBySelective',
    method: 'PUT',
    params
  })
}

export function PostDeleteAPI(params: object) {
  return request({
    url: '/Post/DeleteByCode',
    method: 'get',
    params
  })
}