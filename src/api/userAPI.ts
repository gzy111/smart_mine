import request from "../utils/request"

export function userSelectAllAPI(params: object) {
  return request({
    url: '/User/selectAll',
    method: 'get',
    params
  })

}



