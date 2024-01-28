
<template>
  <div class="head">

    <h1>柳州矿山实业集团</h1>
    <div class="weather"><span id="showTime"></span>
      <!-- <router-link :to="{ path: '/userinfo', query: { reload: 'true' } }"> -->
      <el-button type="primary" @click="redirectToMeasureView()">首页</el-button>
      <!-- </router-link> -->
    </div>
  </div>
  <div class="mainbox">
    <ul class="clearfix">
      <li>
        <div class="boxall" style="height: 3.2rem">
          <div class="alltitle">山体位移状况</div>
          <div class="allnav" id="echart1" style="height:25vh;width: 25vw;" ref="WYChartRef">
          </div>
          <div class="boxfoot"></div>
        </div>
        <div class="boxall" style="height: 3.2rem">
          <div class="alltitle">设备运行状况</div>
          <div class="allnav" id="echart2" style="height:25vh;width: 25vw;">

            <el-table :data="eqinfo" stripe style="width: 100%"
              :row-style="{ background: 'rgba(226, 231, 247)', color: '#bbcafb', opacity: 1, }">
              <el-table-column prop="equipmentCode" label="设备编号" />
              <el-table-column prop="equipmentName" label="设备名称" />
              <el-table-column prop="equipmentType" label="设备类型" />
              <el-table-column prop="state" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type=tagFlg(scope.row.state) disable-transitions color="transparent">{{
                    tagMap.get(scope.row.state)
                  }}</el-tag>
                </template>
              </el-table-column>
            </el-table>

          </div>
          <div class="boxfoot"></div>
        </div>
        <div class="boxall" style="height: 3.2rem">
          <div style="height:100%; width: 100%;">
            <div class="sy" id="fb1" ref="storeSBChartRef"></div>
            <div class="sy" id="fb2" ref="storeYQChartRef"></div>
            <div class="sy" id="fb3" ref="storeKSChartRef">
            </div>
          </div>
          <div class="boxfoot">

          </div>
        </div>
      </li>
      <li>
        <div class="bar">
          <div class="barbox">
            <ul class="clearfix">
              <li class="pulll_left counter">{{ people[0] }}</li>
              <li class="pulll_left counter">{{ people[0] + people[1] }}</li>
            </ul>
          </div>
          <div class="barbox2">
            <ul class="clearfix">
              <li class="pulll_left">到岗员工 </li>
              <li class="pulll_left">全部员工</li>
            </ul>
          </div>
        </div>
        <div class="map">
          <div class="map1"><img src="../style/picture/lbx.png"></div>
          <div class="map2"><img src="../style/picture/jt.png"></div>
          <div class="map3"><img src="../style/picture/map.png"></div>
          <div class="map4" id="map_1"></div>
        </div>
      </li>
      <li>
        <div class="boxall" style="">
          <div class="alltitle">人员</div>
          <div class="allnav" id="echart3" style="height: 2.5rem" ref="peopleChartRef"></div>
          <div class="boxfoot"></div>
        </div>
        <div class="boxall" style="height: 3.2rem">
          <div class="alltitle">重型机械</div>
          <div class="allnav" id="echart4" style="height: 2.5rem" ref="equipmentChartRef"></div>
          <div class="boxfoot"></div>
        </div>
        <div class="boxall" style="height: 3.2rem">
          <div class="alltitle">检测设备</div>
          <div class="allnav" style="height: 2.5rem" ref="equipmentJCChartRef"></div>
          <div class="boxfoot"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

  
<script setup lang="ts">
import { onMounted, Ref, ref, toRefs, toRaw, toRef, defineComponent, onBeforeUnmount, reactive, getCurrentInstance } from 'vue'

import { ECharts, EChartsOption, init } from 'echarts'
import * as echarts from 'echarts';
import { listCountAPI, listSumAPI } from '../api/statisticsAPI'
import { DeptSelectAllAPI } from '../api/deptAPI'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ChatLineRound, Male } from '@element-plus/icons-vue'
import { url } from 'inspector';
import { selectAllAPI } from '../api/equipmentAPI'
import router from '../router';


const tagMap = new Map([
  ["0", "停用"],
  ["1", "运行"],
  ["2", "维修"]
]);
//判断标签
function tagFlg(tag: string) {
  switch (tag) {
    case "0": {
      return "error"
    }
    case "1": {
      return "success"
    }
    case "2": {
      return "warning"
    }
    default: {
      return "0";
    }
  }
}

type EChartsOption = echarts.EChartsOption;
//重型设备
const equipmentChartRef = ref<HTMLDivElement | null>(null);
let equipmentChart: ECharts;
const equipmenty: any = []
const equipmentx: any = []
const equipmentOption: EChartsOption = {
  //  backgroundColor: '#00265f',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    top: '10px',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: equipmentx,
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        width: 4,
        type: "solid"
      },
    },

    axisTick: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      // rotate:50,
      show: true,
      splitNumber: 15,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    },
  }],
  yAxis: [{
    type: 'value',
    axisLabel: {
      //formatter: '{value} %'
      show: true,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    } as AxisLabelOption<"category">,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1	)",
        width: 1,
        type: "solid"
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
      }
    }
  }],
  series: [
    {
      type: 'bar',
      data: equipmenty,
      barWidth: '35%', //柱子宽度
      //  barGap: 3, //柱子之间间距
      itemStyle: {
        normal: {
          color: '#2f89cf',
          opacity: 1,
          barBorderRadius: 5,
        }
      }
    }

  ]
};
//检测设备
const equipmentJCChartRef = ref<HTMLDivElement | null>(null);
let equipmentJCChart: ECharts;
const equipmentJCy: any = []
const equipmentJCx: any = []
const equipmentJCOption: EChartsOption = {
  //  backgroundColor: '#00265f',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    top: '10px',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: equipmentJCx,
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        width: 4,
        type: "solid"
      },
    },

    axisTick: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      // rotate:50,
      show: true,
      splitNumber: 15,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    },
  }],
  yAxis: [{
    type: 'value',
    axisLabel: {
      //formatter: '{value} %'
      show: true,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    } as AxisLabelOption<"category">,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1	)",
        width: 1,
        type: "solid"
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
      }
    }
  }],
  series: [
    {
      type: 'bar',
      data: equipmentJCy,
      barWidth: '35%', //柱子宽度
      //  barGap: 3, //柱子之间间距
      itemStyle: {
        normal: {
          color: '#2f89cf',
          opacity: 1,
          barBorderRadius: 5,
        }
      }
    }

  ]
};

//人员
const peopleChartRef = ref<HTMLDivElement | null>(null);
let peopleChart: ECharts;
const peopley: any = []
const peoplex: any = []
const peopleOption: EChartsOption = {
  //  backgroundColor: '#00265f',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    top: '10px',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: peoplex,
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        width: 4,
        type: "solid"
      },
    },

    axisTick: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      // rotate:50,
      show: true,
      splitNumber: 15,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    },
  }],
  yAxis: [{
    type: 'value',
    axisLabel: {
      //formatter: '{value} %'
      show: true,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    } as AxisLabelOption<"category">,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1	)",
        width: 1,
        type: "solid"
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
      }
    }
  }],
  series: [
    {
      type: 'bar',
      data: peopley,
      barWidth: '35%', //柱子宽度
      //  barGap: 3, //柱子之间间距
      itemStyle: {
        normal: {
          color: '#27d08a',
          opacity: 1,
          barBorderRadius: 5,
        }
      }
    }

  ]
};

//矿石
const storeKSChartRef = ref<HTMLDivElement | null>(null);
let storeKSChart: ECharts;
const storeKSy: any = []
const storeKSx: any = []
const storeKSOption: EChartsOption = {
  title: [{
    text: '库存矿石',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: '16'
    }

  }],
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    position: function (p) {   //其中p为当前鼠标的位置
      return [p[0] + 10, p[1] - 10];
    }
  },
  legend: {
    top: '70%',
    itemWidth: 10,
    itemHeight: 10,
    data: storeKSx,
    textStyle: {
      color: 'rgba(255,255,255,.5)',
      fontSize: '12',
    }
  },
  series: [
    {
      name: '库存矿石',
      type: 'pie',
      center: ['50%', '42%'],
      radius: ['40%', '60%'],
      color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
      label: { show: false },
      labelLine: { show: false },
      data: storeKSy
    }
  ]
};

//仪器
const storeYQChartRef = ref<HTMLDivElement | null>(null);
let storeYQChart: ECharts;
const storeYQy: any = []
const storeYQx: any = []
const storeYQOption: EChartsOption = {
  title: [{
    text: '库存仪器',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: '16'
    }

  }],
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    position: function (p) {   //其中p为当前鼠标的位置
      return [p[0] + 10, p[1] - 10];
    }
  },
  legend: {
    top: '70%',
    itemWidth: 10,
    itemHeight: 10,
    data: storeYQx,
    textStyle: {
      color: 'rgba(255,255,255,.5)',
      fontSize: '12',
    }
  },
  series: [
    {
      name: '库存仪器',
      type: 'pie',
      center: ['50%', '42%'],
      radius: ['40%', '60%'],
      color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
      label: { show: false },
      labelLine: { show: false },
      data: storeYQy
    }
  ]
};

//设备
const storeSBChartRef = ref<HTMLDivElement | null>(null);
let storeSBChart: ECharts;
const storeSBy: any = []
const storeSBx: any = []
const storeSBOption: EChartsOption = {
  title: [{
    text: '库存设备',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: '16'
    }

  }],
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    position: function (p) {   //其中p为当前鼠标的位置
      return [p[0] + 10, p[1] - 10];
    }
  },
  legend: {
    top: '70%',
    itemWidth: 10,
    itemHeight: 10,
    data: storeSBx,
    textStyle: {
      color: 'rgba(255,255,255,.5)',
      fontSize: '12',
    }
  },
  series: [
    {
      name: '库存设备',
      type: 'pie',
      center: ['50%', '42%'],
      radius: ['40%', '60%'],
      color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
      label: { show: false },
      labelLine: { show: false },
      data: storeSBy
    }
  ]
};

//位移
const WYChartRef = ref<HTMLDivElement | null>(null);
let WYChart: ECharts;
const WYy: any = [[1, 1.2, 1.4, 1.2, 1.1, 1.5], [1.5, 1.4, 1.5, 1.5, 1.6, 1.8], [0.5, 0.6, 0.8, 0.6, 0.3, 0.3]]
const WYx: any = [0, 10, 20, 30, 40, 50, 60]
const WYOption: EChartsOption = {

  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['X位移', 'Y位移', 'Z位移']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      // data: WYx
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value} mm'
      }
    }
  ],
  series: [
    {
      name: 'X位移',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: WYy[0]
    },
    {
      name: 'Y位移',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: WYy[1]
    },
    {
      name: 'Z位移',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: WYy[2]
    },
  ]
};

function randomData() {
  const min = 0.0;
  const max = 2.0;
  return Math.random() * (max - min) + min;
}
window.setInterval(function () {
  WYy[0].push(parseFloat(randomData().toFixed(2)))
  WYy[1].push(parseFloat(randomData().toFixed(2)))
  WYy[2].push(parseFloat(randomData().toFixed(2)))
  console.log(WYy, 'WYY');

  WYChart.setOption<echarts.EChartsOption>({
    series: [
      {
        data: WYy[0]
      },
      {
        data: WYy[1]
      },
      {
        data: WYy[2]
      },
    ]
  });
}, 3 * 1000)


const eqinfo = ref([]);
const people: any = []
listCountAPI({ groupByName: 'equipment_name', tableName: 'equipment', whereName: '重型机械', type: 'equipment_type' }).then((res: any) => {
  console.log(res);
  for (let i in res.data) {
    equipmentx.push(res.data[i].name)
    equipmenty.push(res.data[i].count)
  }
  equipmentChart.setOption(equipmentOption);
})
listCountAPI({ groupByName: 'equipment_name', tableName: 'equipment', whereName: '检测设备', type: 'equipment_type' }).then((res: any) => {
  console.log(res);
  for (let i in res.data) {
    equipmentJCx.push(res.data[i].name)
    equipmentJCy.push(res.data[i].count)
  }
  equipmentJCChart.setOption(equipmentJCOption);
})

//库存矿石
listSumAPI({ groupByName: 'name', tableName: 'storehouse', whereName: '矿石', type: 'type', sumName: 'quantity' }).then((res: any) => {
  console.log(res);
  for (let i in res.data) {
    let storeKS = reactive({
      value: '',
      name: ''
    })
    storeKS.name = res.data[i].name
    storeKS.value = res.data[i].count
    storeKSx.push(res.data[i].name)
    storeKSy.push(storeKS)
  }
  storeKSChart.setOption(storeKSOption);
})

//库存仪器
listSumAPI({ groupByName: 'name', tableName: 'storehouse', whereName: '仪器', type: 'type', sumName: 'quantity' }).then((res: any) => {
  console.log(res);
  for (let i in res.data) {
    let temp = reactive({
      value: '',
      name: ''
    })
    temp.name = res.data[i].name
    temp.value = res.data[i].count
    storeYQx.push(res.data[i].name)
    storeYQy.push(temp)
  }
  storeYQChart.setOption(storeYQOption);
})

//库存设备
listSumAPI({ groupByName: 'name', tableName: 'storehouse', whereName: '设备', type: 'type', sumName: 'quantity' }).then((res: any) => {
  console.log(res);
  for (let i in res.data) {
    let temp = reactive({
      value: '',
      name: ''
    })
    temp.name = res.data[i].name
    temp.value = res.data[i].count
    storeSBx.push(res.data[i].name)
    storeSBy.push(temp)
  }
  storeSBChart.setOption(storeSBOption);
})

listCountAPI({ groupByName: 'status', tableName: 'sys_user', }).then((res: any) => {
  console.log(res);
  for (let i in res.data) {
    people.push(res.data[i].count)
  }
  console.log(res, 'people');
})


let pageNum = 1;
const pageSize = 4;
const pages = ref(8);

const topData = reactive({
  pageNum: undefined,
  pageSize: undefined,
  pages: undefined,
})
// 在页面中定义一个标志位，记录页面是否已经刷新过
let isPageReloaded = false

// 在页面第一次加载时，将标志位设置为 true
onMounted(() => {
  isPageReloaded = true
})
function redirectToMeasureView() {
  router.push("/userinfo")
  router.afterEach(() => {
    window.location.reload()
    isPageReloaded = true
  })
}

function getInfo() {
  selectAllAPI({ pageNum: pageNum, pageSize: pageSize }).then((res: any) => {
    eqinfo.value = res.data.data.list
    pages.value = res.data.data.pages
    console.log(res, 'eq');
  })
}
getInfo()

function lunbotu() {
  if (pageNum < pages.value) {
    pageNum = pageNum + 1
  } else {
    pageNum = 1
  }

  getInfo()
}
window.setInterval(lunbotu, 5000);
// setTimeout(function () {
//   console.log("Hello, world!");
// }, 5000);

async function getpeopleData() {
  const res = await listCountAPI({ groupByName: 'dept_id', tableName: 'sys_user' });
  const deptMap = new Map();
  const minres = await DeptSelectAllAPI({});
  for (let i in minres.data) {
    deptMap.set(minres.data[i].deptId, minres.data[i].deptName);
  }

  for (let i in res.data) {
    const name = parseInt(res.data[i].name);
    if (deptMap.has(name)) {
      console.log(deptMap.get(name), "min");
      peoplex.push(deptMap.get(name));
      peopley.push(res.data[i].count);
    } else {
      console.log(`deptMap 中不存在 key 为 ${name} 的值`);
    }
  }
  peopleChart.setOption(peopleOption)

}
getpeopleData()






onMounted(() => {


  const rootElement = document.documentElement;
  rootElement.style.fontSize = '16px'
  document.body.style.backgroundColor = '#000d4a';
  document.body.style.backgroundImage = 'url(http://43.138.242.246/smart_mine/imges/bg.jpg)';
  document.body.style.fontSize = '.1rem'
  document.body.style.fontFamily = '微软雅黑'
  // 设置根元素的 font-size
  setFontSize();
  window.addEventListener('resize', setFontSize);
  // const t = null;
  // t = setTimeout(time,1000);//開始运行
  // function time()
  // {
  //   clearTimeout(t);//清除定时器
  //  let dt = new Date();
  // var y=dt.getFullYear();
  // var mt=dt.getMonth()+1;
  // var day=dt.getDate();
  //   var h=dt.getHours();//获取时
  //   var m=dt.getMinutes();//获取分
  //   var s=dt.getSeconds();//获取秒
  //   document.getElementById("showTime").innerHTML = y+"年"+mt+"月"+day+"-"+h+"时"+m+"分"+s+"秒";
  //   t = setTimeout(time,1000); //设定定时器，循环运行     
  // } 
  equipmentChart = init(equipmentChartRef.value as HTMLElement)
  peopleChart = init(peopleChartRef.value as HTMLElement)
  equipmentJCChart = init(equipmentJCChartRef.value as HTMLElement)
  storeKSChart = init(storeKSChartRef.value as HTMLElement)
  storeYQChart = init(storeYQChartRef.value as HTMLElement)
  storeSBChart = init(storeSBChartRef.value as HTMLElement)

  WYChart = init(WYChartRef.value as HTMLElement)
  WYChart.setOption(WYOption)
  // eqChart = init(eqChartRef.value as HTMLElement)
  // eqChart.setOption(eqoption);
  // 在 nextTick 中执行轮播


})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setFontSize);

});

function setFontSize() {
  const width = document.documentElement.clientWidth;
  const fontSize = width / 20 + 'px';
  document.documentElement.style.fontSize = fontSize;
}





</script>

<style lang="scss" scoped>
.s {
  background-color: rgba(226, 231, 247, 0.1)
}


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

/* CSS Document */
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box
}

*,
body {
  padding: 0px;
  margin: 0px;
  color: #222;
  font-family: "微软雅黑";
}

//修改表格颜色
::v-deep .el-table,
::v-deep .el-table__expanded-cell {
  background-color: transparent !important;
}

/* 表格内背景颜色 */
::v-deep .el-table th,
::v-deep .el-table tr,
::v-deep .el-table td {
  background-color: transparent !important;
  border: 0; //去除表格
}

/*去除底边框*/
::v-deep.el-table td.el-table__cell {
  border: 0;
}

::v-deep.el-table th.el-table__cell.is-leaf {
  border: 0;
}

//修改表格颜色




@font-face {
  font-family: electronicFont;
  src: url(../style/font/DS-DIGIT.TTF)
}

body {
  background: #000d4a url(../images/bg.jpg) center top;
  background-size: cover;
  color: #666;
  font-size: .1rem;
}

li {
  list-style-type: none;
}

table {}

i {
  margin: 0px;
  padding: 0px;
  text-indent: 0px;
}

img {
  border: none;
  max-width: 100%;
}

a {
  text-decoration: none;
  color: #399bff;
}

a.active,
a:focus {
  outline: none !important;
  text-decoration: none;
}

ol,
ul,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  padding: 0;
  margin: 0
}

a:hover {
  color: #06c;
  text-decoration: none !important
}


.clearfix:after,
.clearfix:before {
  display: table;
  content: " "
}

.clearfix:after {
  clear: both
}

.pulll_left {
  float: left;
}

.pulll_right {
  float: right;
}

/*谷哥滚动条样式*/

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  position: absolute
}

::-webkit-scrollbar-thumb {
  background-color: #5bc0de
}

::-webkit-scrollbar-track {
  background-color: #ddd
}

/***/
.canvas {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 99%;
  z-index: 1;
}

.allnav {
  height: calc(100% - 30px);
}

.loading {
  position: fixed;
  left: 0;
  top: 0;
  font-size: 18px;
  z-index: 100000000;
  width: 100%;
  height: 100%;
  background: #1a1a1c;
  text-align: center;
}

.loadbox {
  position: absolute;
  width: 160px;
  height: 150px;
  color: #aaa;
  left: 50%;
  top: 50%;
  margin-top: -100px;
  margin-left: -75px;
}

.loadbox img {
  margin: 10px auto;
  display: block;
  width: 40px;
}

.copyright {
  background: rgba(19, 31, 64, .32);
  border: 1px solid rgba(255, 255, 255, .05);
  line-height: .5rem;
  text-align: center;
  padding-right: 15px;
  bottom: 0;
  color: rgba(255, 255, 255, .7);
  font-size: .16rem;
}

.head {
  height: 1.05rem;
  background: url(../style/picture/head_bg.png) no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
}

.head h1 {
  color: #fff;
  text-align: center;
  font-size: .4rem;
  line-height: .8rem;
}

.head h1 img {
  width: 1.5rem;
  display: inline-block;
  vertical-align: middle;
  margin-right: .2rem
}

.weather {
  position: absolute;
  right: .3rem;
  top: 0;
  line-height: .75rem;
}

.weather img {
  width: .37rem;
  display: inline-block;
  vertical-align: middle;
}

.weather span {
  color: rgba(255, 255, 255, .7);
  font-size: .18rem;
  padding-right: .1rem;
}

.mainbox {
  padding: .1rem .1rem 0rem .1rem;
}

.mainbox>ul {}

.mainbox>ul>li {
  float: left;
  padding: 0 .1rem
}

.mainbox>ul>li {
  width: 30%
}

.mainbox>ul>li:nth-child(2) {
  width: 40%;
  padding: 0
}

.boxall {
  border: 1px solid rgba(25, 186, 139, .17);
  padding: 0 .2rem .4rem .15rem;

  background: rgba(255, 255, 255, .04) url(../style/picture/line.png);
  background-size: 100% auto;
  position: relative;
  margin-bottom: .15rem;
  z-index: 10;
}

.boxall:before,
.boxall:after {
  position: absolute;
  width: .1rem;
  height: .1rem;
  content: "";
  border-top: 2px solid #02a6b5;
  top: 0;
}

.boxall:before,
.boxfoot:before {
  border-left: 2px solid #02a6b5;
  left: 0;
}

.boxall:after,
.boxfoot:after {
  border-right: 2px solid #02a6b5;
  right: 0;
}

.alltitle {
  font-size: .2rem;
  color: #fff;
  text-align: center;
  line-height: .5rem;
}

.boxfoot {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}

.boxfoot:before,
.boxfoot:after {
  position: absolute;
  width: .1rem;
  height: .1rem;
  content: "";
  border-bottom: 2px solid #02a6b5;
  bottom: 0;
}

.bar {
  background: rgba(101, 132, 226, .1);
  padding: .15rem;
}

.barbox li,
.barbox2 li {
  width: 50%;
  text-align: center;
  position: relative;
  z-index: 100;
}

.barbox:before,
.barbox:after {
  position: absolute;
  width: .3rem;
  height: .1rem;
  content: "";
}

.barbox:before {
  border-left: 2px solid #02a6b5;
  left: 0;
  border-top: 2px solid #02a6b5;
}

.barbox:after {
  border-right: 2px solid #02a6b5;
  right: 0;
  bottom: 0;
  border-bottom: 2px solid #02a6b5;
}

.barbox li:first-child:before {
  position: absolute;
  content: "";
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, .2);
  right: 0;
  top: 25%;
}

.barbox {
  border: 1px solid rgba(25, 186, 139, .17);
  position: relative;
}

.barbox li {
  font-size: .7rem;
  color: #ffeb7b;
  padding: .05rem 0;
  font-family: electronicFont;
  font-weight: bold;
}

.barbox2 li {
  font-size: .19rem;
  color: rgba(255, 255, 255, .7);
  padding-top: .1rem;
}

.map {
  position: relative;
  height: 7.2rem;
  z-index: 9;
}

.map4 {
  width: 200%;
  height: 7rem;
  position: relative;
  left: -50%;
  top: 4%;
  margin-top: .2rem;
  z-index: 5;
}

.map1,
.map2,
.map3 {
  position: absolute;
  opacity: .5
}

.map1 {
  width: 6.43rem;
  z-index: 2;
  top: .45rem;
  left: .7rem;
  animation: myfirst2 15s infinite linear;
}

.map2 {
  width: 5.66rem;
  top: .85rem;
  left: 1.2rem;
  z-index: 3;
  opacity: 0.2;
  animation: myfirst 10s infinite linear;
}

.map3 {
  width: 5.18rem;
  top: 1.07rem;
  left: 1.4rem;
  z-index: 1;
}





.tabs {
  text-align: center;
  padding: .1rem 0 0 0;
}

.tabs a {
  position: relative;
  display: inline-block;
  margin-left: 1px;
  padding: .05rem .2rem;
  color: #898989;
  transition: all .3s ease-out 0s;
  font-size: 14px;
}

.tabs li {
  display: inline-block;
}

.tabs a:after {
  position: absolute;
  width: 1px;
  height: 10px;
  background-color: rgba(255, 255, 255, .1);
  content: '';
  margin-left: 0;
  right: -1px;
  margin-top: 7px;


}

.tabs li a.active {
  border: 1px solid rgba(25, 186, 139, .17);
  background: rgba(255, 255, 255, .05);
  color: #fff;
}

.tit02 {
  text-align: center;
  margin: .1rem 0;
  position: relative
}

.tit02 span {
  border: 1px solid rgba(25, 186, 139, .17);
  letter-spacing: 2px;
  padding: .01rem .2rem;
  background: rgba(255, 255, 255, .05);
  font-size: .18rem;
  color: #49bcf7;
}

.tit02:before,
.tit02:after {
  position: absolute;
  width: 26%;
  height: 1px;
  background: rgba(25, 186, 139, .2);
  content: "";
  top: .12rem;
}

.tit02:after {
  right: 0;
}

.tit02:before {
  left: 0;
}

.wrap {
  height: 2.54rem;
  overflow: hidden;
}

.wrap li {
  line-height: .42rem;
  height: .42rem;
  font-size: .18rem;
  text-indent: .24rem;
  margin-bottom: .1rem;
}

.wrap li p {
  border: 1px solid rgba(25, 186, 139, .17);
  color: rgba(255, 255, 255, .6);
}

.sy {
  float: left;
  width: 33%;
  height: 95%;
  margin-top: .25rem;
}


.adduser {
  height: 1.5rem;
  overflow: hidden;
}

.adduser li {
  height: .5rem;
}

.adduser img {
  width: .40rem;
  border-radius: .5rem;
  margin-right: .1rem;
  display: inline-block;
  vertical-align: middle;
}

.adduser span {
  line-height: .5rem;
  font-size: .18rem;
  color: rgba(255, 255, 255, .6);
}

.sycm ul {
  margin-left: -.5rem;
  margin-right: -.5rem;
  padding: .16rem 0;
}

.sycm li {
  float: left;
  width: 33.33%;
  text-align: center;
  position: relative
}

.sycm li:before {
  position: absolute;
  content: "";
  height: 30%;
  width: 1px;
  background: rgba(255, 255, 255, .1);
  right: 0;
  top: 15%;
}

.sycm li:last-child:before {
  width: 0;
}

.sycm li h2 {
  font-size: .3rem;
  color: #c5ccff;
}

.sycm li span {
  font-size: .18rem;
  color: #fff;
  opacity: .5;
}

@keyframes myfirst2 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

@keyframes myfirst {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-359deg);
  }
}


/*Plugin CSS*/
.str_wrap {
  overflow: hidden;
  width: 100%;
  position: relative;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  white-space: nowrap;
}


.str_move {
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  cursor: move;
}

.str_move_clone {
  display: inline-block;
  vertical-align: top;
  position: absolute;
  left: 100%;
  top: 0;
}

.str_vertical .str_move_clone {
  left: 0;
  top: 100%;
}

.str_down .str_move_clone {
  left: 0;
  bottom: 100%;
}

.str_vertical .str_move,
.str_down .str_move {
  white-space: normal;
  width: 100%;
}

.str_static .str_move,
.no_drag .str_move,
.noStop .str_move {
  cursor: inherit;
}

.str_wrap img {
  max-width: none !important;
}
</style>