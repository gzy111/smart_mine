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

export function deleteUserAPI(params: object) {
  return request({
    url: '/User/DeleteUser',
    method: 'get',
    params
  })
}

export function updateUserAPI(params: object) {
  return request({
    url: '/User/UpdateUser',
    method: 'PUT',
    params
  })
}

export function insertUserAPI(params: object) {
  return request({
    url: '/User/InsertUser',
    method: 'POST',
    params
  })
}
