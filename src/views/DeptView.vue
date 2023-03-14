<template>

  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="设备名称" prop="equipmentName">
      <el-input v-model="ruleForm.equipmentName"   />
    </el-form-item>
    <el-form-item label="设备类型" prop="equipmentType">
      <el-select v-model="ruleForm.equipmentType" placeholder="Activity zone" >
        <el-option      
      v-for="item in toRaw(equipmentTypeList)"
      :key="item"
      :label="item.codeName"
      :value="item.code+','+item.codeName" />
      </el-select>
    </el-form-item>

    <el-form-item label="设备状态"  prop="state">
      <el-select v-model="ruleForm.state" placeholder="Activity zone">
        <el-option label="运行" value="1" />
        <el-option label="停用" value="0" />
        <el-option label="维修" value="2" />
      </el-select>
    </el-form-item>


    <el-form-item label="设备分配" prop="equipmentUser" >
      <el-select v-model="ruleForm.equipmentUser" placeholder="Activity zone" filterable >
        <el-option      
          v-for="item in toRaw(userList)"
          :key="item"
          :label="item.userName"
          :value="item.userId" />
          </el-select>
      
    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Create
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>

</template>

<script lang="ts" setup>
import { reactive, ref ,toRef ,toRaw} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {lookSelectAPI} from "../api/lookupAPI"
import{userSelectAllAPI} from "../api/userAPI"
import {inserAPI} from "../api/equipmentAPI"


const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  equipmentName: '',
  equipmentType: '',
  equipmentUser: '',
  state:''
})

interface lookEquipment {
  userId: string
  userName: string
}
interface User {
  userId: string
  codeName: string
}

const equipmentTypeList=ref<lookEquipment>()
const userList=ref<User>()

const rules = reactive<FormRules>({
  equipmentName: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    
  ],
  equipmentType: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change',
    },
  ],
  state: [
    {
      required: true,
      message: '请选择状态',
      trigger: 'change',
    },
  ],
})

//todo
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
    inserAPI( ruleForm ).then((res: any) => {
        console.log(res,"res");
    });

    } else {
      console.log('error submit!', fields)
    }
  })
}


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))



lookSelectAPI({ typeName:"设备类型" }).then((res: any) => {
  equipmentTypeList.value = res.data.data
  });

  userSelectAllAPI({ }).then((res: any) => {
    userList.value = res.data.data    
  });


console.log(equipmentTypeList);
</script>
