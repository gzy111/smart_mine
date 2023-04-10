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


<el-row>
    <el-col :span="8">
    <div ref="airChartRef" style="width: 600px; height: 500px;"  class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="8">
    <div ref="CoChartRef" style="width: 600px; height: 500px;"  class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="8">
    <div ref="CH4ChartRef" style="width: 600px; height: 500px;"  class="grid-content ep-bg-purple"></div>
    </el-col>
</el-row>
<el-row :gutter="30">
    <el-col :span="8">
        <div ref="weatherChart" style="width: 800px; height: 500px; background-color: antiquewhite;"  class="grid-content ep-bg-purple"></div>
    </el-col>
</el-row>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref,toRefs,toRaw,toRef } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios';
import { ChatLineRound, Male } from '@element-plus/icons-vue'
const weatherChart = ref<HTMLDivElement | null>(null);



type EChartsOption = echarts.EChartsOption;

let chart: ECharts;  //天气预报

const temperature:any=[] 
const humidity:any=[]
const date:any=[]

//实况天气
const LiveWeather=ref('')
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
    //   interval: 10,
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
      name: '温度',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value as number + ' °C';
        }
      },
      data: temperature
    },
    {
      name: '风向',
      type: 'line',
      yAxisIndex: 0,
      data: ['西南','西北']
    },
  ]
  };


/** 空气 */
const airChartRef = ref<HTMLDivElement | null>(null);
let airChart: ECharts;  //空气质量
//空气质量值
const gaugeData = [
  {
    value: 15,
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
    value: 25,
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
    value: 35,
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
    value: 25,
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
const airOption:EChartsOption={
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
const CoOption: EChartsOption= {
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
      data: [
        {
          value: 0.6,
          name: '一氧化碳浓度(CO)'
        }
      ]
    }
  ]
};

/**瓦斯 */
const CH4ChartRef = ref<HTMLDivElement | null>(null);
let CH4Chart: ECharts; 
const CH4Option: EChartsOption= {
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
}


onMounted(() => {
  chart = init(weatherChart.value as HTMLElement)
  airChart=init(airChartRef.value as HTMLElement)
  CoChart=init(CoChartRef.value as HTMLElement)
  CH4Chart=init(CH4ChartRef.value as HTMLElement)
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