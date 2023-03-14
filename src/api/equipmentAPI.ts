import request from "../utils/request"

export function selectAllAPI(params: object) {
  return request({
    url: '/Equipment/equipmentSelectAll',
    method: 'get',
    params
  })

}

export function deleteAPI(params: object) {
  return request({
    url: '/Equipment/equipmentDeleteByCode',
    method: 'get',
    params
  })
}

export function inserAPI(params: object) {
  return request({
    url: '/Equipment/equipmentInsertSelective',
    method: 'post',

    params
  })
}

export function equipmentUpdateAPI(params: object) {
  return request({
    url: '/Equipment/equipmentUpdateBySelective',
    method: 'PUT',
    params
  })
}