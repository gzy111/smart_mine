import request from "../utils/request"

export function listCountAPI(params: object) {
  return request({
    url: '/Statistics/ListCount',
    method: 'get',
    params
  })
}
export function listSumAPI(params: object) {
    return request({
      url: '/Statistics/ListSum',
      method: 'get',
      params
    })
  }
  