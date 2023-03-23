<template>
    <div id="repair_main">


        <div class="top">

        </div>

        <div class="form_div">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-button @click="statusEvent(null)">
                    全部
                </el-button>
                <el-button @click="statusEvent('0')">
                    维修完成
                </el-button>
           
                <el-button @click="statusEvent('1')">
                    待维修
                </el-button>
                <el-button @click="statusEvent('2')">
                    维修中
                </el-button>
            </el-col>

            <el-col :span="4" :offset="8">
                <el-input v-model="input" placeholder="Please input" />
            </el-col>
            <el-col :span="2" >
                <el-button type="primary" :icon="Search">Search</el-button>
            </el-col>
            </el-row>

            <el-table :data="repairList" v-loading="loading" style="width: 100% ;" >
                <el-table-column label="维修编号" prop="repairCode" sortable />
                <el-table-column label="设备编号" prop="equipmentCode" />
                <el-table-column label="设备名称" prop="equipment.equipmentName" />
                <el-table-column label="故障信息" prop="errorInfo" />
                <el-table-column label="维修人员" prop="repairUser" />
                <el-table-column label="创建时间" prop="createTime" />
                <el-table-column label="维修时间" prop="repairTime" />
                <el-table-column label="完成时间" prop="finishTime" />
                <el-table-column prop="state" label="状态" width="100" >
                    <template #default="scope">
                        <el-tag :type=tagFlg(scope.row.state) disable-transitions>{{ tagMap.get(scope.row.state) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="right">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-tooltip class="box-item" effect="light" content="报修" placement="bottom-end"> <el-button
                                size="small" type="warning" @click="handleRepair(scope.$index, scope.row)"><el-icon>
                                    <Warning />
                                </el-icon></el-button></el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size=pageNum :page-count="total" layout="prev, pager, next,total,jumper" :total="total"
                @next-click="nextClik()" @prev-click="prevClik()" v-model:current-page="currentPage"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import {  ref, toRefs, reactive, toRaw, shallowReactive, onBeforeMount,getCurrentInstance } from 'vue'
import type { FormInstance, FormRules ,ElMessage} from 'element-plus'
import { Delete, Edit, Search, Share, Warning } from '@element-plus/icons-vue'
import{RepairDeleteAPI,RepairInsertAPI,RepairSelectPageAPI,RepairUpdateAPI} from '../api/repairAPI'
const { proxy } = getCurrentInstance()
//传参
const datas = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    state: undefined,
    equipmentCode:undefined,
    repairCode:undefined,
  },
});
const total=ref()
const repairList=ref([])
const loading=ref(false)
const repairForm = reactive({
    repairCode: '',
    repairTime: '',
    createTime: '',
    finishTime: '',
    errorInfo: '',
    repairUser: '',
    equipmentCode:'',
    data: '',
    state:''
})
const { queryParams } = toRefs(datas);
const tagMap = new Map([
  ["0", "维修完成"],
  ["1", "待维修"],
  ["2", "维修中"]
]);

//判断标签
function tagFlg(tag: string) {
  switch (tag) {
    case "0": {
      return "success"
    }
    case "1": {
      return "info"
    }
    case "2": {
      return "warning"
    }
    default: {
      return "0";
    }
  }
}
function getRepairList(){
    loading.value=true
    RepairSelectPageAPI(queryParams.value).then((res: any) => {
    repairList.value=res.data.list
    console.log(res.data.list)
    loading.value=false
  });
}
//根据状态分类
const statusEvent=(state:any) =>{
    queryParams.value.state=state
    getRepairList();
}
getRepairList()

</script>
<style>
.form_div {
    background-color: rgb(68, 187, 223);
    height: 70%;
    width: 98%;
    margin: 0 auto;
}

.top {
    background-color: rgb(242, 253, 253);
    height: 100px;
    width: 98%;
    margin: 15px auto;
    border-radius: 5px 5px 5px 5px
}
</style>
  