import request from "../utils/request"

export function userSelectAllAPI(params: object) {
  return request({
    url: '/User/selectAll',
    method: 'get',
    params
  })
}
export function userSelectPageAPI(params: object) {
  return request({
    url: '/User/selectPage',
    method: 'get',
    params
  })
}

export function deleteUser(params: object) {
  return request({
    url: '/User/DeleteUser',
    method: 'get',
    params
  })
}

export function updateUser(params: object) {
  return request({
    url: '/User/UpdateUser',
    method: 'PUT',
    params
  })
}

export function insertUser(params: object) {
  return request({
    url: '/User/InsertUser',
    method: 'PUT',
    params
  })
}
