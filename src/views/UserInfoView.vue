<template>
  <el-table :data="info" style="width: 100%">
    <el-table-column label="Date" prop="date" />
    <el-table-column label="设备编号" prop="equipmentCode" />
    <el-table-column label="设备名称" prop="equipmentName" />
    <el-table-column label="设备类型" prop="equipmentType" />
    <el-table-column label="状态" prop="state" />
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :page-size=pageNum
    :page-count="total"
    layout="prev, pager, next,total,jumper"
    :total="total"
    @next-click="nextClik()"
    @prev-click="prevClik()"
    v-model:current-page="currentPage"
    @current-page="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
import { computed, ref,onMounted ,reactive,toRaw,shallowReactive, onBeforeMount} from 'vue'
import { mallGoodsDetailAPI } from "../api/index";
interface equipment {
  date: string
  equipmentCode: string
  equipmentName: string
  equipmentType: string
  state:string
  total:number
}
const pageNum=ref(1);
const pageSize=ref(5);
const total=ref(0)
const pageCount=ref(0)
const currentPage=ref(1);

const nextClik=()=>{
  pageNum.value += 1
  console.log(pageNum.value,'1111');
  list()
}
const prevClik=()=>{
    pageNum.value -= 1
  console.log(pageNum.value,'1111');
  list()
}

var info = ref<equipment>() 

var a = ref()
const handleEdit = (index: number, row: equipment) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: equipment) => {
  console.log(index, row)
}
interface page {
  pageNum: number
  pageSize?: number
}
function list(){
  mallGoodsDetailAPI({pageNum:pageNum.value,pageSize:pageSize.value}).then( (res: any) => {
      info.value =res.data.data.list
      total.value=res.data.data.pages
      pageCount.value=res.data.data.total
	});
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

list()





</script>