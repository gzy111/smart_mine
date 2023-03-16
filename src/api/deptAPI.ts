import request from "../utils/request"

export function DeptSelectAllAPI(params: object) {
  return request({
    url: '/Dept/SelectAll',
    method: 'get',
    params
  })
}

export function DeptTree(params: object) {
  return request({
    url: 'Dept/TreeSelect',
    method: 'get',
    params
  })
}

