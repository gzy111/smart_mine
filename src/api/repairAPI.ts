import request from "../utils/request"

export function RepairSelectPageAPI(params: object) {
  return request({
    url: '/Repair/selectPage',
    method: 'get',
    params
  })
}

export function RepairInsertAPI(params: object) {
    return request({
      url: '/Repair/insertSelective',
      method: 'POST',
      params
    })
  }
  
export function RepairDeleteAPI(params: object) {
    return request({
      url: '/Repair/deleteByPrimaryKey',
      method: 'GET',
      params
    })
  }
  
export function RepairUpdateAPI(params: object) {
    return request({
      url: '/Repair/updateByPrimaryKeySelective',
      method: 'PUT',
      params
    })
  }
  
  