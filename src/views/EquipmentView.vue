<template>
     <el-row class="mb-4">
    <el-button type="primary">Primary</el-button>
  </el-row>

  <el-table :data="info" v-loading="loading" style="width: 100%">
    <el-table-column label="Date" prop="date" sortable />
    <el-table-column label="设备编号" prop="equipmentCode" />
    <el-table-column label="设备名称" prop="equipmentName" />
    <el-table-column label="设备类型" prop="equipmentType" />
    <el-table-column prop="state" label="状态" width="100" :filter-method="filterTag" :filters="[
      { text: '停用', value: '0' },
      { text: '运行', value: '1' },
      { text: '维修', value: '2' },
    ]">
      <template #default="scope">
        <el-tag :type=tagFlg(scope.row.state) disable-transitions>{{ tagMap.get(scope.row.state) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)" type="warning">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination :page-size=pageNum :page-count="total" layout="prev, pager, next,total,jumper" :total="total"
    @next-click="nextClik()" @prev-click="prevClik()" v-model:current-page="currentPage"
    @current-change="handleCurrentChange" />
</template>
  
<script lang="ts" setup>
import { computed, ref, onMounted, reactive, toRaw, shallowReactive, onBeforeMount } from 'vue'
import { selectAllAPI, deleteAPI ,inserAPI} from "../api/equipmentAPI"
interface equipment {
  date: string
  equipmentCode: string
  equipmentName: string
  equipmentType: string
  state: string
  total: number
}
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0)
const pageCount = ref(0)
const currentPage = ref(1);
const loading = ref(false)
const info = ref<equipment>()


const nextClik = () => {
  pageNum.value += 1
  list()
}
const prevClik = () => {
  pageNum.value -= 1
  list()
}
const tagMap = new Map([
  ["0", "停用"],
  ["1", "运行"],
  ["2", "维修"]
]);


const handleEdit = (index: number, row: equipment) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: equipment) => {
  console.log(index, row)
  deleteAPI({ code: toRaw(row).equipmentCode }).then((res: any) => {
    list()
  })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  list()
}
const filterTag = (value: string, row: equipment) => {
  return row.state === value
}

//更新equipment的数据
function list() {
  loading.value = true
  selectAllAPI({ pageNum: currentPage.value, pageSize: pageSize.value }).then((res: any) => {
    info.value = res.data.data.list
    total.value = res.data.data.pages
    pageCount.value = res.data.data.total
    loading.value = false
  });
}

//判断标签
function tagFlg(tag: string) {
  switch (tag) {
    case "0": {
      return "info"
    }
    case "1": {
      return "success"
    }
    case "2": {
      return "warning"
    }
    default: {
      return "";
    }
  }
}



list()






</script>