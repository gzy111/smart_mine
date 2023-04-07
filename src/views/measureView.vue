<template>
    <el-row>
        <el-col :span="4">
            <el-statistic :value="null">
            <template #default>
            </template>
            <template #title>
                <div style="display: inline-flex; align-items: center">
                当前风力
                </div>
            </template>
            <template #suffix>{{ LiveWeather.city }}</template>
        </el-statistic>
    </el-col>
    <el-col :span="4">
        <el-statistic :value="null">
            <template #default>
            </template>
            <template #title>
                <div style="display: inline-flex; align-items: center">
                当前风力
                </div>
            </template>
            <template #suffix>{{ LiveWeather.windpower }}</template>
        </el-statistic>
    </el-col>


    <el-col :span="4">
    <el-statistic :value="null">
  <template #default>
  </template>
  <template #title>
    <div style="display: inline-flex; align-items: center">
      当前风向
    </div>
  </template>
  <template #suffix>{{ LiveWeather.winddirection }}</template>
</el-statistic>
    </el-col>


    <el-col :span="4">
      <el-statistic :value="LiveWeather.temperature_float" >
        <template #title>
          <div style="display: inline-flex; align-items: center">
            当前温度
          </div>
        </template>

        <template #suffix>°C</template>
      </el-statistic>
    </el-col>


    <el-col :span="4">
      <el-statistic :value="LiveWeather.humidity_float">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            当前湿度
          </div>
        </template>
        <template #suffix>%</template>
      </el-statistic>
    </el-col>

    <el-col :span="4">
      <el-statistic title="更新时间" formatter="YYYY-MM-DD HH:mm:ss" :value="LiveWeather.reporttime" />
    </el-col>
  </el-row>

    <el-row :gutter="30">
        <el-col :span="6">
    <div ref="chartRef" style="width: 500px; height: 400px; background-color: antiquewhite;"  class="grid-content ep-bg-purple"></div>
</el-col>
<el-col :span="6">
    <div ref="chartRef" style="width: 500px; height: 400px; "  class="grid-content ep-bg-purple"></div>
</el-col>
<el-col :span="6">
    <div ref="chartRef" style="width: 500px; height: 400px;"  class="grid-content ep-bg-purple"></div>
</el-col>
</el-row>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref,toRefs,toRaw,toRef } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios';
import { ChatLineRound, Male } from '@element-plus/icons-vue'
const chartRef = ref<HTMLDivElement | null>(null);
type EChartsOption = echarts.EChartsOption;
let chart: ECharts;
const temperature:any=[]
const humidity:any=[]
const date:any=[]

//实况天气
const LiveWeather=ref('')
//天气预报
const option: EChartsOption = {
    title: {
    text: '24小时天气预报'
  },
    tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  toolbox: {
    feature: {
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ['Evaporation', 'Temperature']
  },
  xAxis: [
    {
      type: 'category',
      data: date,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Precipitation',
      min: 0,
      max: 100,
    //   interval: 10,
      axisLabel: {
        formatter: '{value} %'
      }
    },
    {
      type: 'value',
      name: 'Temperature',
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: '{value} °C'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' ml';
        }
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ],
      barWidth: '20%'
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' °C';
        }
      },
      data: temperature
    }
  ]
  };

const initChart = () => {
  chart.setOption(option);
}


onMounted(() => {

  chart = init(chartRef.value as HTMLElement)
})

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
          getLiveWeather()
        } else {
            city.value ="苏州"
            getWeather()
            getLiveWeather()
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
            '&key=05c5400c7a3d5ecd76586cc564182514&extensions=all'
        )
        .then((res) => {
            console.log(res.data.forecasts[0].casts,"sss");
            const casts=res.data.forecasts[0].casts
            for(let key in casts ){
                date.push(casts[key].date)
                humidity.push(casts[key].nightpower)
                temperature.push(casts[key].daytemp)
            }
          weather.value = res.data // 将请求返回的天气信息赋值给 weather 变量
          initChart()
        })
    }
    function getLiveWeather(){
        axios
        .get(
          'https://restapi.amap.com/v3/weather/weatherInfo?city=' +
            city.value +
            '&key=05c5400c7a3d5ecd76586cc564182514&extensions=base'
        )
        .then((res) => {
           // 将请求返回的天气信息赋值给 weather 变量
          console.log(LiveWeather,"www");

          LiveWeather.value = res.data.lives[0]      
        })
    }

    console.log(date,"date");



</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>