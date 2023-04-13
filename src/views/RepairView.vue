<template>
  <div id="repair_main">
    <div class="top">


    </div>
    <div class="form_div">
      <el-row>
        <el-form :inline="true" :model="queryParams" ref="ruleFormRef" class="demo-form-inline" style="margin: 0 0;">
          <el-row>
            <el-form-item label="维修编号">
              <el-input v-model="queryParams.repairCode" placeholder="维修编号" />
            </el-form-item>
            <el-form-item label="维修人员">
              <el-input v-model="queryParams.repairUser" placeholder="维修人员" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-button @click="statusEvent(null)" type="primary">
            全部
          </el-button>
          <el-button @click="statusEvent('0')" type="success">
            维修完成
          </el-button>

          <el-button @click="statusEvent('1')" type="info">
            待维修
          </el-button>
          <el-button @click="statusEvent('2')" type="warning">
            维修中
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="repairList" v-loading="loading" style="width: 100% ;">
        <el-table-column label="维修编号" prop="repairCode" sortable width="200" />
        <el-table-column label="设备编号" prop="equipmentCode" width="100" />
        <el-table-column label="设备名称" prop="equipment.equipmentName" width="100" />
        <el-table-column label="故障信息" prop="errorInfo" width="200" />
        <el-table-column label="维修人员" prop="repairUser" width="150" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="维修时间" prop="repairTime" width="180" />
        <el-table-column label="完成时间" prop="finishTime" width="180" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="scope">
            <el-tag :type=tagFlg(scope.row.state) disable-transitions>{{ tagMap.get(scope.row.state) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-tooltip class="box-item" effect="light" content="报修" placement="bottom-end"> <el-button size="small"
                type="warning" @click="handleRepair(scope.$index, scope.row)"><el-icon>
                  <Warning />
                </el-icon></el-button></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size=queryParams.pageNum v-show="total > 0" layout="prev, pager, next,total,jumper"
        :total="total" v-model:current-page="queryParams.pageNum" @current-change="handleCurrentChange" />
    </div>
  </div>


  <!-- ---------------------------弹窗 ------------------------------------------------------------>
  <el-dialog v-model="dialogFormVisible" title="编辑维修" destroy-on-close width="700px" :align-center="true" :center="true">
    <div class="dialog-container">
      <el-form :model="repairForm" ref="ruleFormRef" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="维修编号">
              <el-input v-model="repairForm.repairCode" :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备名称">
              <el-input v-model="repairForm.equipmentName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="12">
            <el-form-item label="维修状态" prop="state">
              <el-select v-model="repairForm.state" placeholder="请选择维修状态">
                <el-option label="维修完成" value="0" />
                <el-option label="待维修" value="1" />
                <el-option label="维修中" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修人员">
              <el-select v-model="repairForm.repairUser" placeholder="请选择员工" filterable clearable width="50%">
                <el-option v-for="item in toRaw(userList)" :key="item" :label="item.userId + ',' + item.userName"
                  :value="item.userId + ',' + item.userName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="故障信息">
          <el-input v-model="repairForm.errorInfo" />
        </el-form-item>

        <el-form-item label="故障原因">
          <el-input v-model="repairForm.data" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" :plain="true">
            保存
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>

    </div>

  </el-dialog>
  <!-- ----------------------弹窗------------------------------------------------------------------->
</template>
  
<script lang="ts" setup>
import { ref, toRefs, reactive, toRaw, shallowReactive, onBeforeMount, getCurrentInstance } from 'vue'
import type { FormInstance, FormRules, ElMessage } from 'element-plus'
import { Delete, Edit, Search, Share, Warning } from '@element-plus/icons-vue'
import { RepairDeleteAPI, RepairInsertAPI, RepairSelectPageAPI, RepairUpdateAPI } from '../api/repairAPI'
import { userSelectPageAPI } from '../api/userAPI'
const { proxy } = getCurrentInstance()
//传参
const datas = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    state: undefined,
    equipmentCode: undefined,
    repairCode: undefined,
    repairUser: undefined,
  },
});
const dialogFormVisible = ref(false)
const total = ref()
const repairList = ref([])
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const userList = ref([])
const repairForm = reactive({
  repairCode: '',
  repairTime: '',
  createTime: '',
  finishTime: '',
  errorInfo: '',
  repairUser: '',
  equipmentCode: undefined,
  equipmentName: undefined,
  data: '',
  state: ''
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


//获取维修部门用户信息
userSelectPageAPI({ deptId: '213' }).then((res: any) => {
  userList.value = res.data.list
  console.log(res, "s");
});

//获取维修信息
function getRepairList() {
  loading.value = true
  RepairSelectPageAPI(queryParams.value).then((res: any) => {
    repairList.value = res.data.list
    total.value = res.data.pages
    console.log(res.data.list)
    loading.value = false
  });
}
//根据状态分类
const statusEvent = (state: any) => {
  queryParams.value.state = state
  getRepairList();
}
getRepairList()
//搜索
const search = () => {
  getRepairList();
}

const reset = () => {
  queryParams.value.repairCode = undefined
  queryParams.value.repairUser = undefined

}

//分页
const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val
  getRepairList()
}

//点击编辑按钮，内容添加到弹出框
const handleEdit = (index: number, row: any) => {
  dialogFormVisible.value = true
  repairForm.repairCode = row.repairCode
  repairForm.equipmentName = row.equipment.equipmentName
  repairForm.state = row.state
  repairForm.repairUser = row.repairUser
  repairForm.errorInfo = row.errorInfo
  repairForm.data = row.data
  repairForm.equipmentCode = row.equipmentCode

}

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    //添加
    if (valid) {
      console.log(repairForm);

      RepairUpdateAPI(repairForm).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('添加成功')
        getRepairList() //更新数据
      });
    } else {
      console.log('error');
      proxy.$message.error('出现异常')
    }
  })
}


//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogFormVisible.value = false
}

//删除
const handleDelete = (row: any) => {

  proxy.$msgbox.confirm('确认要删除' + '"' + row.repairCode + '"维修订单吗?').then(function () {
    RepairDeleteAPI({ repairCode: row.repairCode }).then((res: any) => {
      getRepairList()
    });
  }).then(() => {
    proxy.$message.success("删除成功");
  }).catch(function () {

  });
  console.log(row);
}


</script>
<style>
.form_div {
  height: 70%;
  width: 98%;
  margin: 0 auto;
}

.top {
  background-color: rgb(242, 253, 253);
  position: relative;
  height: 100px;
  width: 98%;
  margin: 15px auto;
  align-items: center;
  text-align: center;
  vertical-align:middle;
  border-radius: 5px 5px 5px 5px;
  line-height: 100px;
}


</style>
  