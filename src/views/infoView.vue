<template>
  <el-form :model="userFrom" label-width="120px">
    <el-form-item label="员工ID">
      <el-input v-model="userFrom.userId" :disabled="true" />
    </el-form-item>
    <el-form-item label="员工姓名">
      <el-input v-model="userFrom.userName" />
    </el-form-item>

    <el-form-item label="性别">
      <el-radio-group v-model="userFrom.sex">
        <el-radio label="男" />
        <el-radio label="女" />
      </el-radio-group>
    </el-form-item>

    <el-form-item label="家庭住址">
      <el-input v-model="userFrom.addres" />
    </el-form-item>

    <el-form-item label="邮箱">
      <el-input v-model="userFrom.email" />
    </el-form-item>

    <el-form-item label="手机号码">
      <el-input v-model="userFrom.phonenumber" />
    </el-form-item>

    <el-form-item label="身份证">
      <el-input v-model="userFrom.idCard" />
    </el-form-item>

    <el-form-item label="部门">
      <el-select v-model="userFrom.deptId" placeholder="please select your zone" filterable @change="changed">
        <el-option v-for="item in toRaw(deptList)" :key="item" :label="item.deptName" :value="item.deptId" />
      </el-select>
    </el-form-item>

    <el-form-item label="岗位">
      <el-select v-model="userFrom.postName" placeholder="please select your zone">
        <el-option v-for="item in toRaw(postList)" :key="item" :label="item.postName" :value="item.postId" />
      </el-select>
    </el-form-item>


    <el-form-item label="状态">
      <el-switch v-model="userFrom.status" />
    </el-form-item>
    <el-form-item label="定位">
      <el-input v-model="userFrom.userName" />
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
import { updateUserAPI, insertUserAPI } from '../api/userAPI'
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
  