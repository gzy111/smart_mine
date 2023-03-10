import request from "../utils/request"

export function lookSelectAPI(params: object) {
  return request({
    url: 'LookUp/selectAll',
    method: 'get',
    params
  })

}

export function deleteAPI(params: object) {
  return request({
    url: '/LookUp/deleteAPI',
    method: 'get',
    params
  })

}
