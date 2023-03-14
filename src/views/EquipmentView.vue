<template>
     <el-row class="mb-4">
      <el-button  @click="dialog()">
        新增设备
  </el-button>
  </el-row>

  <el-table :data="info" v-loading="loading" style="width: 100%">
    <el-table-column label="Date" prop="date" sortable />
    <el-table-column label="设备编号" prop="equipmentCode" />
    <el-table-column label="设备名称" prop="equipmentName" />
    <el-table-column label="设备类型" prop="equipmentType" />
    <el-table-column label="使用员工" prop="equipmentUser" />
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



<!-- ---------------------------弹窗 ------------------------------------------------------------>
<el-dialog v-model="dialogFormVisible" :title="ruleForm.equipmentType?'编辑设备': '新增设备'" align-center destroy-on-close width="23%">

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
      <el-input v-model="ruleForm.equipmentName"  style="width: 214px;" />
    </el-form-item>
    <el-form-item label="设备类型" prop="equipmentType">
      <el-select v-model="ruleForm.equipmentType" placeholder="请选择设备类型" >
        <el-option      
      v-for="item in toRaw(equipmentTypeList)"
      :key="item"
      :label="item.codeName"
      :value="item.code+','+item.codeName" />
      </el-select>
    </el-form-item>

    <el-form-item label="设备状态"  prop="state">
      <el-select v-model="ruleForm.state" placeholder="请选择设备状态">
        <el-option label="运行" value="1" />
        <el-option label="停用" value="0" />
        <el-option label="维修" value="2" />
      </el-select>
    </el-form-item>


    <el-form-item label="设备分配" prop="equipmentUser" >
      <el-select v-model="ruleForm.equipmentUser" placeholder="请选择员工" filterable clearable >
        <el-option      
          v-for="item in toRaw(userList)"
          :key="item"
          :label="item.userId+','+item.userName"
          :value="item.userId+','+item.userName" />
          </el-select>
      
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)" :plain="true" >
        保存
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </el-form-item>
  </el-form>
   
  </el-dialog>
<!-- ----------------------弹窗------------------------------------------------------------------->
</template>
  
<script lang="ts" setup>
import { computed, ref, onMounted, reactive, toRaw, shallowReactive, onBeforeMount,getCurrentInstance } from 'vue'
import { selectAllAPI, deleteAPI ,inserAPI,equipmentUpdateAPI} from "../api/equipmentAPI"

import type { FormInstance, FormRules ,ElMessage} from 'element-plus'
import {lookSelectAPI} from "../api/lookupAPI"
import{userSelectAllAPI} from "../api/userAPI"
import {plains} from "../utils/plain"

interface equipment {
  date: string
  equipmentCode: string
  equipmentName: string
  equipmentType: string
  equipmentUser: string
  state: string
  total: number
}
const { proxy } = getCurrentInstance()
//分页
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0)
const pageCount = ref(0)
const currentPage = ref(1);


const loading = ref(false)
const info = ref<equipment>()

const equipmentTypeList=ref<lookEquipment>()
const userList=ref<User>()
const ruleForm = reactive({
  equipmentCode: '',
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

//点击编辑按钮，内容添加到弹出框
const handleEdit = (index: number, row: equipment) => {
  dialogFormVisible.value=true
  ruleForm.equipmentCode=row.equipmentCode
  ruleForm.equipmentName=row.equipmentName
  ruleForm.equipmentType=row.equipmentType
  ruleForm.equipmentUser=row.equipmentUser
  ruleForm.state=row.state
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
      return "0";
    }
  }
}
list()




/**
 * 弹窗
 * 
 */
const dialogFormVisible = ref(false)
const dialog= () => {
  dialogFormVisible.value=true
  ruleForm.equipmentName=''
  ruleForm.equipmentType=''
  ruleForm.equipmentUser=''
  ruleForm.state=''
}



const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()


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

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    
    //添加
    if (valid && ruleForm.equipmentCode=='') {
    inserAPI( ruleForm ).then((res: any) => {
      dialogFormVisible.value=false
      proxy.$message.success('添加成功')
      list() //更新数据
    });
    } else if (valid && ruleForm.equipmentCode){
      //修改信息
      console.log(ruleForm, fields)
      equipmentUpdateAPI( ruleForm ).then((res: any) => {
      dialogFormVisible.value=false
      proxy.$message.success('修改成功')
      list() //更新数据
    });

    }else{
      console.log('error');
      proxy.$message.error('出现异常')
    }

 
  })
}



//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogFormVisible.value=false

}





lookSelectAPI({ typeName:"设备类型" }).then((res: any) => {
  equipmentTypeList.value = res.data.data
  });

  userSelectAllAPI({ }).then((res: any) => {
    userList.value = res.data.data    
    console.log(res.data.data ,"s");
    
  });




</script>