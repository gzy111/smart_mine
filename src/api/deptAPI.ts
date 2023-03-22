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

export function DeptSelectPage(params: object) {
  return request({
    url: 'Dept/SelectPage',
    method: 'get',
    params
  })
}

export function DeptInset(params: object) {
  return request({
    url: 'Dept/InsertSelective',
    method: 'POST',
    params
  })
}

export function DeptUpdate(params: object) {
  return request({
    url: 'Dept/UpdateBySelective',
    method: 'PUT',
    params
  })
}

export function DeptDelete(params: object) {
  return request({
    url: 'Dept/DeleteByCode',
    method: 'get',
    params
  })
}