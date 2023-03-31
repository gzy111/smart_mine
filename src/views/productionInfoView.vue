<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>

import axios from 'axios';

const appKey = '204175383'; // 替换成你的阿里云应用程序密钥
const appSecret = 'mFlZ4jwK0loDeFpt50ZiGNttOgUtSATp'; // 替换成你的阿里云应用程序密钥
const apiUrl = 'http://aliv8.data.moji.com/whapi/json/aliweather/forecast15days'; // 替换成你的阿里云 API 网关 URL
const params = {
  // 替换成你的 API 参数
  'lat': '22.78133333',
  'lon': '108.2731667',
};

const formData=new FormData();
formData.append('lat','22.78133333');
formData.append('lon','108.2731667');
const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `APPCODE a165ea84682348e9ba1f5163cc19828f`,
  }
};

const appCode = 'a165ea84682348e9ba1f5163cc19828f'; // 替换成你的阿里云应用程序代码

axios.post(apiUrl, formData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `APPCODE ${appCode}`,
  },
}).then(response => {
  console.log(response.data);
});

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

</script>
