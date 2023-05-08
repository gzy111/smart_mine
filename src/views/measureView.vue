<template>
  <el-row>
    <el-col :span="4">
      <el-statistic :value="null">
        <template #default>
        </template>
        <template #title>
          <div style="display: inline-flex; align-items: center">
            当前城市
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
            当前天气
          </div>
        </template>
        <template #suffix>{{ LiveWeather.weather }}</template>
      </el-statistic>
    </el-col>


    <el-col :span="4">
      <el-statistic :value="LiveWeather.temperature_float">
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


  <el-row>
    <el-col :span="8">
      <div ref="airChartRef" style="width: 600px; height: 500px;" class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="8">
      <div ref="CoChartRef" style="width: 600px; height: 500px;" class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="8">
      <div ref="CH4ChartRef" style="width: 600px; height: 500px;" class="grid-content ep-bg-purple"></div>
    </el-col>
  </el-row>
  <el-row :gutter="30">
    <el-col :span="8">
      <div ref="hoursChartRef" style="width: 90vw; height: 500px; " class="grid-content ep-bg-purple"></div>
    </el-col>
  </el-row>
  <el-row :gutter="30">
    <el-col :span="8">
      <div ref="weatherChart" style="width: 90vw; height: 500px; " class="grid-content ep-bg-purple"></div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref, toRefs, toRaw, toRef } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios';
import { ChatLineRound, Male } from '@element-plus/icons-vue'
const weatherChart = ref<HTMLDivElement | null>(null);

type EChartsOption = echarts.EChartsOption;

let chart: ECharts;  //天气预报
const wea: any = [[], [], [], [], []]
const date: any = []
const hoursWea: any = [[], [], [], [], [], [], [], []]

//实况天气
const LiveWeather = ref('')
//天气预报
const option: EChartsOption = {
  title: {
    text: '天气预报'
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
      name: '湿度',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value} %'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5470C6'
        }
      },
    },
    {
      type: 'value',
      name: '温度',
      min: 0,
      max: 60,
      interval: 10,
      axisLabel: {
        formatter: '{value} °C',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#91CC75'
        }
      },

    }

  ],
  series: [
    {
      name: '湿度',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' %';
        }
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ],
      barWidth: '20%'
    },
    {
      name: '最高温度',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' °C';
        }
      },
      data: wea[0],
      itemStyle: {
        color: '#fd666d'
      }
    },
    {
      name: '最低温度',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' °C';
        }
      },
      data: wea[1],
      itemStyle: {
        color: '#37a2da'
      }
    },
    {
      name: '风向',
      type: 'line',
      yAxisIndex: 0,
      data: wea[4]
    },
    {
      name: '天气',
      type: 'line',
      yAxisIndex: 0,
      data: wea[3]
    },
  ]
};


//24小时预报
const hoursChartRef = ref<HTMLDivElement | null>(null);
let hoursChart: ECharts;
const hoursOption: EChartsOption = {
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
      data: hoursWea[0],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '湿度',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value} %'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5470C6'
        }
      },
    },
    {
      type: 'value',
      name: '温度',
      min: 0,
      max: 60,
      interval: 10,
      axisLabel: {
        formatter: '{value} °C',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#fd666d'
        }
      },

    }

  ],
  series: [
    {
      name: '湿度',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' %';
        }
      },
      data: hoursWea[2],
      barWidth: '20%'
    },
    {
      name: '温度',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' °C';
        }
      },
      data: hoursWea[1],
      itemStyle: {
        color: '#fd666d'
      }
    },

    {
      name: '风力等级',
      type: 'line',
      yAxisIndex: 0,
      data: hoursWea[4]
    },
    {
      name: '风速',
      type: 'line',
      yAxisIndex: 0,
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' km/h';
        }
      },
      data: hoursWea[6]
    },
    {
      name: '天气',
      type: 'line',
      yAxisIndex: 0,
      data: hoursWea[3]
    },
    {
      name: '降雨概率',
      type: 'line',
      yAxisIndex: 0,
      data: hoursWea[5]
    },
  ]
};

/** 空气 */
const airChartRef = ref<HTMLDivElement | null>(null);
let airChart: ECharts;  //空气质量
//空气质量值
const gaugeData = [
  {
    value: 0,
    name: '二氧化硫(SO₂)',
    title: {
      offsetCenter: ['0%', '-60%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['0%', '-50%']
    }
  },
  {
    value: 0,
    name: '臭氧(O3)',
    title: {
      offsetCenter: ['0%', '-30%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['0%', '-20%']
    }
  },
  {
    value: 0,
    name: '二氧化氮(NO₂)',
    title: {
      offsetCenter: ['0%', '0%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['0%', '10%']
    }
  },
  {
    value: 0,
    name: 'PM2.5',
    title: {
      offsetCenter: ['0%', '30%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['0%', '40%']
    }
  },
];

const coData = [
  {
    value: 0,
    name: '一氧化碳浓度(CO)'

  }
]
const airOption: EChartsOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#464646'
        }
      },
      axisLine: {
        lineStyle: {
          width: 40
        }
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        distance: 50
      },
      data: gaugeData,
      title: {
        fontSize: 14
      },
      detail: {
        width: 70,
        height: 14,
        fontSize: 14,
        color: 'inherit',
        borderColor: 'inherit',
        borderRadius: 20,
        borderWidth: 1,
        formatter: '{value}μg/m³'
      }
    }
  ]
}


/**CO */
const CoChartRef = ref<HTMLDivElement | null>(null);
let CoChart: ECharts;
const CoOption: EChartsOption = {
  title: {
    text: ''
  },
  series: [
    {
      type: 'gauge',
      min: 0,
      max: 50,
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'inherit'
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -30,
        length: 30,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'inherit',
        distance: 40,
        fontSize: 20
      },
      detail: {
        valueAnimation: true,
        formatter: '{value} mg/m³',
        color: 'inherit'
      },
      data: coData
    }
  ]
};

/**瓦斯 */
const CH4ChartRef = ref<HTMLDivElement | null>(null);
let CH4Chart: ECharts;
const CH4Option: EChartsOption = {
  title: {
    text: ''
  },
  series: [
    {
      type: 'gauge',
      min: 0,
      max: 5,
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.2, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'inherit'
        }
      },
      axisTick: {
        distance: -30,
        splitNumber: 10,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -30,
        length: 30,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'inherit',
        distance: 40,
        fontSize: 20
      },
      detail: {
        valueAnimation: true,
        formatter: '{value} %',
        color: 'inherit'
      },
      data: [
        {
          value: 0.6,
          name: '瓦斯(CH₄)'
        }
      ]
    }
  ]
};

const initChart = () => {
  chart.setOption(option);
  airChart.setOption(airOption);
  CoChart.setOption(CoOption);
  CH4Chart.setOption(CH4Option);
  hoursChart.setOption(hoursOption);

}

onMounted(() => {
  chart = init(weatherChart.value as HTMLElement)
  airChart = init(airChartRef.value as HTMLElement)
  CoChart = init(CoChartRef.value as HTMLElement)
  CH4Chart = init(CH4ChartRef.value as HTMLElement)
  hoursChart = init(hoursChartRef.value as HTMLElement)
})


const options = {
  key: '05c5400c7a3d5ecd76586cc564182514',
  version: '2.0',
  plugins: ['AMap.Geolocation']
}
const city = ref('') // 定义城市变量
const weather = ref('') // 定义天气变量
const position = ref('')
const lat = ref('')
const lng = ref('')
// 获取城市信息
onMounted(() => {
  AMapLoader.load(options).then((AMap) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      convert: true
    })
    geolocation.getCityInfo(function (status, result) {
      if (status === 'complete') {
        city.value = "柳州"
        console.log('城市查询成功：', city)
        getWeather()
        getLiveWeather()
      } else {
        console.log('城市查询失败：', result)
        city.value = "柳州"
      }
    })

    geolocation.getCurrentPosition(function (status, result) {
      if (status === 'complete') {
        position.value = result.position
        console.log(result.position.lat, 'result.position.lat');
        lat.value = result.position.lat
        lng.value = result.position.lng
        console.log('定位查询成功：', position)
        getHoursWeather()
        getAir()
      } else {
        lat.value = "31.30356"
        lng.value = "120.59241"
        getHoursWeather()
        getAir()
        console.log('定位查询失败：', result)
      }
    })

  })
})
// 获取天气信息
function getWeather() {
  console.log(city, 'city');
  axios
    .get(
      'https://restapi.amap.com/v3/weather/weatherInfo?city=' +
      city.value +
      '&key=05c5400c7a3d5ecd76586cc564182514&extensions=all'
    )
    .then((res) => {
      console.log(res.data.forecasts[0].casts, "sss");
      const casts = res.data.forecasts[0].casts
      for (let key in casts) {
        date.push(casts[key].date)
        wea[0].push(casts[key].daytemp) //最高温
        wea[1].push(casts[key].nighttemp) //最低温
        wea[2].push(casts[key].nightpower) //降雨量
        wea[3].push(casts[key].dayweather) //天气
        wea[4].push(casts[key].daywind) //风向

      }
      weather.value = res.data // 将请求返回的天气信息赋值给 weather 变量
      // initChart()
    })
}
//获取24小时天气
function getHoursWeather() {
  const appCode = 'a165ea84682348e9ba1f5163cc19828f'; // 替换成你的阿里云应用程序代码
  const apiUrl = 'http://aliv8.data.moji.com/whapi/json/aliweather/forecast24hours'; // 替换成你的阿里云 API 网关 URL
  const formData = new FormData();
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `APPCODE ${appCode}`,
    },
  }
  formData.append('lat', lat.value);
  formData.append('lon', lng.value);
  axios
    .post(
      apiUrl, formData, config

    )
    .then((res) => {
      const casts = res.data.data.hourly
      for (let key in casts) {
        hoursWea[0].push(casts[key].hour) //小时
        hoursWea[1].push(casts[key].temp) //温度
        hoursWea[2].push(casts[key].humidity) //湿度
        hoursWea[3].push(casts[key].condition) //天气
        hoursWea[4].push(casts[key].windlevel) //风力等级
        hoursWea[5].push(casts[key].pop) //降雨概率
        hoursWea[6].push(casts[key].windSpeed)//风速

      }
      initChart()
    })
}


//获取空气
function getAir() {
  const appCode = 'a165ea84682348e9ba1f5163cc19828f'; // 替换成你的阿里云应用程序代码
  const apiUrl = 'http://aliv8.data.moji.com/whapi/json/aliweather/aqi'; // 替换成你的阿里云 API 网关 URL
  const formData = new FormData();
  formData.append('lat', lat.value);
  formData.append('lon', lng.value);


  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `APPCODE ${appCode}`,
    },
  }
  axios
    .post(
      apiUrl, formData, config

    )
    .then((res) => {
      console.log(res, "aly");
      const casts = res.data.data.aqi
      coData[0].value = casts.coC //一氧化碳
      gaugeData[0].value = casts.so2C//二氧化硫
      gaugeData[1].value = casts.o3C //臭氧
      gaugeData[2].value = casts.no2C //二氧化氮
      gaugeData[3].value = casts.pm25C //PM2.5
      initChart()

    })
}

function getLiveWeather() {
  axios
    .get(
      'https://restapi.amap.com/v3/weather/weatherInfo?city=' +
      city.value +
      '&key=05c5400c7a3d5ecd76586cc564182514&extensions=base'
    )
    .then((res) => {
      // 将请求返回的天气信息赋值给 weather 变量
      console.log(LiveWeather, "www");
      LiveWeather.value = res.data.lives[0]
    })
}

</script>

<style scoped>
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