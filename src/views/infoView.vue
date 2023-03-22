<template>

  <el-form :model="userFrom" label-width="120px">
    <el-row>
      <el-col :span="12">
    <el-form-item label="部门ID">
      <el-input v-model="userFrom.userId" :disabled="true" />
    </el-form-item>
    </el-col>

    <el-col :span="12">
    <el-form-item label="部门名称">
      <el-input v-model="userFrom.userName" />
    </el-form-item>
  </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-form-item label="邮箱">
      <el-input v-model="userFrom.phonenumber" />
    </el-form-item>
  </el-col>
  <el-col :span="12">
    <el-form-item label="手机号码">
      <el-input v-model="userFrom.email" />
    </el-form-item>
  </el-col>
  </el-row>
   
    <el-form-item label="负责人"  >
      <el-select v-model="userFrom.userName" placeholder="请选择员工" filterable clearable >
        <el-option      
          v-for="item in toRaw(userList)"
          :key="item"
          :label="item.userId+','+item.userName"
          :value="item.userId+','+item.userName" />
          </el-select>
      
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="userFrom.status" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="userFrom.remark" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>

</template>
  
<script lang="ts" setup>
import { tr } from 'element-plus/es/locale';
import { ref, reactive, toRaw, getCurrentInstance } from 'vue'
import { DeptSelectAllAPI } from '../api/deptAPI'
import { PostSelectAPI } from '../api/postAPI'
import { updateUserAPI, insertUserAPI,userSelectAllAPI } from '../api/userAPI'
import type { FormInstance, FormRules } from 'element-plus'

const userFrom = reactive({
  userId: undefined,
  userName: undefined,
  deptId: '',
  postId: '',
  status: '',
  sex: '',
  idCard: '',
  email: '',
  addres: '',
  phonenumber: undefined,
  userPosition: '',
  remark: '',
})
const userList=ref([])
userSelectAllAPI({ }).then((res: any) => {
    userList.value = res.data.data    
    console.log(res.data.data ,"s");
  });

const { proxy } = getCurrentInstance()
/**
 * 弹窗
 * 
 */
const dialogFormVisible = ref(false)

const deptList = ref<deptTypeList>()
const postList = ref<postTypeList>()
interface deptTypeList {
  deptId: number
  deptName: string
}
interface postTypeList {
  postId: number
  postName: string
}

function changed(val: any) {
  PostSelectAPI({ deptId: val }).then((res: any) => {
    postList.value = res.data.list
    console.log(postList);
  });
}


DeptSelectAllAPI({}).then((res: any) => {
  deptList.value = res.data
  console.log(deptList);
});

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    //添加
    if (valid && userFrom.userId == '') {
      insertUserAPI(userFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('添加成功')

      });
    } else if (valid && userFrom.userId) {
      //修改信息
      console.log(userFrom, fields)
      updateUserAPI(userFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('修改成功')

      });

    } else {
      console.log('error');
      proxy.$message.error('出现异常')
    }

  })
}


</script>
  
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
  