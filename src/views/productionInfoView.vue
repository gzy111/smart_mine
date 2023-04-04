<template>


<div>
    <p>{{ weather }}</p>
    <button @click="getWeather">获取天气信息</button>
  </div>
</template>

<script lang="ts" setup>

import axios from 'axios';
import AMapLoader from '@amap/amap-jsapi-loader'
import { computed, ref, reactive, toRaw, getCurrentInstance, toRefs,onMounted } from 'vue'
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



const options = {
  key: '05c5400c7a3d5ecd76586cc564182514',
  version: '2.0',
  plugins: ['AMap.Geolocation']
}
const city = ref('') // 定义城市变量
const weather = ref('') // 定义天气变量
const position= ref('')
    // 获取城市信息
    onMounted(()=>{

       AMapLoader.load(options).then((AMap) => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        convert: true
      })
      geolocation.getCityInfo(function (status, result) {
        if (status === 'complete') {
          city.value = result.city
          console.log('城市查询成功：', city)
          getWeather()
        } else {
          console.log('城市查询失败：', result)
        }
      })

      geolocation.getCurrentPosition(function (status, result) {
        if (status === 'complete') {
          position.value=result
          console.log('定位查询成功：',position )
        } else {
          console.log('定位查询失败：', result)
        }
      })

    })
  })

    // 获取天气信息
    function getWeather() {
      axios
        .get(
          'https://restapi.amap.com/v3/weather/weatherInfo?city=' +
            city.value +
            '&key=05c5400c7a3d5ecd76586cc564182514'
        )
        .then((res) => {
          weather.value = res.data // 将请求返回的天气信息赋值给 weather 变量
        })
    }






</script>
