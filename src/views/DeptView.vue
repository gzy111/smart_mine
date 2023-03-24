<template>
  <el-row class="mb-4">
    <el-button @click="addDept()">
      新增部门
    </el-button>
  </el-row>
  <el-table :data="tableData" style="width: 100%" v-loading="loading">
    <el-table-column prop="deptId" label="部门id" width="150" />
    <el-table-column prop="deptName" label="部门名字" width="150" />
    <el-table-column prop="leader" label="负责人" width="150" />
    <el-table-column prop="phone" label="负责人手机" width="150" />
    <el-table-column prop="email" label="负责人邮箱" width="200" />
    <el-table-column prop="createTime" label="创建时间" width="200" />
    <el-table-column prop="status" label="状态" width="150">
      <template #default="scope">
        <el-switch v-model="scope.row.status" active-value="true" inactive-value="false"
          @click="handleStatusChange(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"></el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)" :icon="Delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination :page-size=queryParams.pageNum :page-count="total" layout="prev, pager, next,total,jumper" :total="total"
    v-model:current-page="queryParams.pageNum" @current-change="handleCurrentChange" />

  <!-- ---------------------------弹窗 ------------------------------------------------------------>
  <el-dialog v-model="dialogFormVisible" :title="DeptFrom.deptId ? '编辑部门' : '新增部门'" destroy-on-close width="30%"
    :align-center="true" :center="true">
    <div class="dialog-container">
      <el-form :model="DeptFrom" ref="ruleFormRef" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门ID">
              <el-input v-model="DeptFrom.deptId" :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="部门名称">
              <el-input v-model="DeptFrom.deptName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-select v-model="DeptFrom.leader" placeholder="请选择员工" filterable clearable>
                <el-option v-for="item in toRaw(userList)" :key="item" :label="item.userId + ',' + item.userName"
                  :value="item.userId + ',' + item.userName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="DeptFrom.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="邮箱">
          <el-input v-model="DeptFrom.email" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="DeptFrom.status" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="DeptFrom.remark" type="textarea" />
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
import { ref, getCurrentInstance, reactive, toRefs, toRaw, } from 'vue'
import { DeptSelectPage, DeptInset, DeptUpdate, DeptDelete } from "../api/deptAPI"
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, ElMessage } from 'element-plus'
import { userSelectAllAPI } from '../api/userAPI'
const tableData = ref([])
const { proxy } = getCurrentInstance()
const dialogFormVisible = ref(false)
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const userList = ref([])
//获取所有用户信息
userSelectAllAPI({}).then((res: any) => {
  userList.value = res.data.data
  console.log(res.data.data, "s");
});
const DeptFrom = reactive({
  deptId: undefined,
  deptName: undefined,
  leader: '',
  phone: '',
  status: '',
  email: '',
  createTime: '',
  remark: '',
})

//传参
const datas = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: undefined,
  },
});
const total = ref()
const { queryParams } = toRefs(datas);


/** 查询部门列表 */
function getDeptList() {
  loading.value = true;
  DeptSelectPage(queryParams.value).then(res => {
    console.log(res.data);
    tableData.value = res.data.list;
    total.value = res.data.pages
    loading.value = false;
  });
};
getDeptList()
//点击编辑按钮，内容添加到弹出框
const handleEdit = (index: number, row: any) => {
  dialogFormVisible.value = true
  DeptFrom.deptId = row.deptId
  DeptFrom.deptName = row.deptName
  DeptFrom.leader = row.leader
  if (row.status == 'true') {
    DeptFrom.status = ref(true)
  } else {
    DeptFrom.status = ref(false)
  }
  DeptFrom.email = row.email
  DeptFrom.phone = row.phone
  DeptFrom.createTime = row.createTime
  DeptFrom.remark = row.remark
  console.log(row, "ss");
}
//删除
const handleDelete = (row: any) => {
  proxy.$msgbox.confirm('确认要删除' + '"' + row.deptName + '"部门吗?').then(function () {
    DeptDelete({ deptId: row.deptId }).then((res: any) => {
      getDeptList()
    });
  }).then(() => {
    proxy.$message.success("删除成功");
  }).catch(function () {

  });
  console.log(row);
}
/** 部门状态修改  */
function handleStatusChange(row: any) {
  let text = row.status == "true" ? "启用" : "停用";
  proxy.$msgbox.confirm('确认要"' + text + '""' + row.deptName + '"部门吗?').then(function () {
    // console.log(row,"sss");
    DeptUpdate({ deptId: row.deptId, status: row.status }).then((res: any) => {
      getDeptList()
    });

  }).then(() => {
    proxy.$message.success(text + "成功");
  }).catch(function () {
    row.status = row.status == "true" ? "false" : "true";
  });
};

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    //添加
    if (valid && DeptFrom.deptId == undefined) {
      DeptInset(DeptFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('添加成功')
        getDeptList() //更新数据
      });
    } else if (valid && DeptFrom.deptId) {
      //修改信息
      DeptUpdate(DeptFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('修改成功')
        getDeptList() //更新数据
      });

    } else {
      console.log('error');
      proxy.$message.error('出现异常')
    }

    console.log(DeptFrom);

  })
}

//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogFormVisible.value = false

}

//新增部门
const addDept = () => {
  dialogFormVisible.value = true
  DeptFrom.deptId = undefined
  DeptFrom.deptName = undefined
  DeptFrom.leader = ''
  DeptFrom.status = ''
  DeptFrom.email = ''
  DeptFrom.phone = ''
  DeptFrom.createTime = ''
  DeptFrom.remark = ''
}

const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val
  getDeptList()
}
</script>
<style>
.dialog-container {
  position: relative;
  height: 100%;
}

.form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>