import request from "../utils/request"

export function mallGoodsDetailAPI(params: object) {
  return request({
    url: '/Equipment/equipmentSelectAll',
    method: 'get',
    params
  })

}

export function testAPI(params: object) {
  return request({
    url: 'Equipment/selectAllpageInfo?pageNum=2&pageSize=3',
    method: 'get',
    params
  })
}
