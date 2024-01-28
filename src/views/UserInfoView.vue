<template>
  <el-row :gutter="20">
    <el-col :span="4" :xs="24">
      <el-input v-model="filterText" placeholder="Filter keyword" />
      <el-tree ref="treeRef" class="filter-tree" :data="dataTree" :props="defaultProps" default-expand-all
        :filter-node-method="filterNode" @node-click="handleNodeClick" />
    </el-col>

    <el-col :span="20" :xs="24">
      <el-row>
        <el-form :inline="true" :model="queryParams" ref="ruleFormRef" class="demo-form-inline" style="margin: 0 0;">
          <el-row>
            <el-form-item label="姓名">
              <el-input v-model="queryParams.userName" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="queryParams.phonenumber" placeholder="手机号" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>

      </el-row>
      <div style="float: left;">
        <el-button @click="addUser()">
          新增员工
        </el-button>
      </div>

      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="userId" label="用户id" width="100" />
        <el-table-column prop="userName" label="姓名" width="100" />
        <el-table-column prop="sex" label="性别" width="100" />
        <el-table-column prop="phonenumber" label="手机" width="150" />
        <el-table-column prop="dept.deptName" label="部门" width="100" />
        <el-table-column prop="post.postName" label="岗位" width="100" />
        <el-table-column prop="userPosition" label="位置" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-value="true" inactive-value="false"
              @click="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="员工照片" width="100">
          <template #default="scope">
            <el-avatar shape="square" :size="50" fit="fit" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"></el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)" :icon="Delete"></el-button>
            <el-button size="small" @click="handleInfo(scope.$index, scope.row)" :icon="User"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :page-size=queryParams.pageNum :page-count="total" layout="prev, pager, next,total,jumper"
        :total="total" v-model:current-page="queryParams.pageNum" @current-change="handleCurrentChange" />

    </el-col>
  </el-row>

  <!---------------------------------------------------------弹窗------------------------------------->
  <el-dialog v-model="dialogFormVisible" :title="userFrom.userId ? '员工信息' : '新增员工'" align-center destroy-on-close
    width="40%">
    <el-form ref="ruleFormRef" :rules="rules" :model="userFrom" label-width="120px" :disabled="infoFlag">
      <el-avatar shape="square" :size="100" fit="fit" :src="userFrom.avatar" />

      <el-upload ref="upload" class="upload-demo" :action="uploadUrl" :limit="1" :on-exceed="handleExceed"
        :auto-upload="false" accept=".jpg,.png" :on-success="handleUploadSuccess">
        <template #trigger>
          <el-button type="primary">选择图片</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload">
          更新图片
        </el-button>
        <template #tip>
          <div class="el-upload__tip text-red">
            替换头像
          </div>
        </template>
      </el-upload>



      <el-row>
        <el-col :span="12">
          <el-form-item label="员工ID">
            <el-input v-model="userFrom.userId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="员工姓名" prop="userName">
            <el-input v-model="userFrom.userName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="userFrom.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="userFrom.phonenumber" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="家庭住址">
        <el-input v-model="userFrom.addres" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="userFrom.email" />
      </el-form-item>



      <el-form-item label="身份证">
        <el-input v-model="userFrom.idCard" />
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="部门" prop="deptId">
            <el-select v-model="userFrom.deptId" placeholder="请选择部门" filterable @change="changed">
              <el-option v-for="item in toRaw(deptList)" :key="item" :label="item.deptName" :value="item.deptId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="userFrom.postId" placeholder="请选择岗位">
              <el-option v-for="item in toRaw(postList)" :key="item" :label="item.postName" :value="item.postId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-switch v-model="userFrom.status" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定位">
            <el-input v-model="userFrom.userPosition" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input v-model="userFrom.remark" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
  <!---------------------------------------------------------------弹窗--------------------------------------------------------- -->
</template>

<script lang="ts" setup>
import { ref, watch, toRaw, toRef, reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { ElTree } from 'element-plus'
import { DeptSelectAllAPI, DeptTree } from "../api/deptAPI"
import { userSelectPageAPI } from "../api/userAPI"
import { PostSelectAPI } from '../api/postAPI'
import { updateUserAPI, insertUserAPI, deleteUserAPI } from '../api/userAPI'
import type { FormInstance, FormRules, ElMessage } from 'element-plus'
import { Delete, Edit, Search, Share, Upload, User } from '@element-plus/icons-vue'
import type { UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'



//头像
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl:
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
})
const uploadUrl = ref('http://127.0.0.1:80/File/UploadImage')
console.log(uploadUrl)
const upload = ref<UploadInstance | null>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
}
const handleUploadSuccess = (response: any) => {
  console.log(response.data, "image")
  userFrom.avatar = response.data
  updateUserAPI(userFrom).then(() => {
    getList()
  })
}
const submitUpload = () => {
  if (upload.value) {
    upload.value.submit()
  }
  console.log(upload, 'upload')
}



const imageUrl = ref('')
interface Tree {
  id: string
  label: string
  children?: Tree[]
}
const filterText = ref('')
const loading = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const dialogFormVisible = ref(false)
const infoFlag = ref(true)
const userList = ref([])
const defaultProps = {
  children: 'children',
  label: 'label',
}


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
  avatar: '',
  phonenumber: undefined,
  userPosition: '',
  remark: '',
})

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



const { proxy } = getCurrentInstance()
//传参
const datas = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: undefined,
    postId: undefined,
    userName: undefined,
    phonenumber: undefined,
  },
});
const total = ref()
const { queryParams } = toRefs(datas);

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

//节点单击事件
const handleNodeClick = (data: Tree) => {
  console.log(data)
  // if(data.id=1)
  let str = data.id
  //岗位编码由P+部门ID(3位数字)+岗位ID组成
  if (str.substring(0, 1) == 'P') {
    console.log("p");
    queryParams.value.deptId = Number(str.substring(1, 4))
    queryParams.value.postId = Number(str.substring(4, 7))
    queryParams.value.phonenumber = undefined
    queryParams.value.userName = undefined
    console.log(queryParams.value);
    getList()
  } else if (str.substring(1, 4) != '') {
    queryParams.value.deptId = str
    console.log(str, "str");
    queryParams.value.postId = undefined;
    queryParams.value.phonenumber = undefined
    queryParams.value.userName = undefined
    getList()
  } else {
    queryParams.value.deptId = undefined;
    queryParams.value.postId = undefined;
    queryParams.value.phonenumber = undefined
    queryParams.value.userName = undefined
    getList()
  }
}

//树形结构信息
const info = ref(undefined)

//树形结构
DeptTree({}).then((res: any) => {
  info.value = res.data
});


//搜索
const search = () => {
  getList();
}

const reset = () => {
  queryParams.value.userName = undefined
  queryParams.value.phonenumber = undefined
  getList()

}

const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val
  getList()
}

/** 查询用户列表 */
function getList() {
  loading.value = true;
  userSelectPageAPI(queryParams.value).then(res => {


    userList.value = res.data.list;
    total.value = res.data.pages
    loading.value = false;
    console.log(res.data.list, 'user');

  });
};

//选择器改变事件
function changed(val: any) {
  PostSelectAPI({ deptId: val }).then((res: any) => {
    postList.value = res.data.list
    console.log(res, "post");
  });
}

const ruleFormRef = ref<FormInstance>()


const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },

  ],
  deptId: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change',
    },
  ],
  phonenumber: [
    {
      required: true,
      message: '请输入手机号码',
      trigger: 'change',
    },
  ],
})

//查询所有部门
DeptSelectAllAPI({}).then((res: any) => {
  deptList.value = res.data
  console.log(deptList);
});
//点击编辑按钮，内容添加到弹出框
const handleEdit = (index: number, row: any) => {
  dialogFormVisible.value = true
  infoFlag.value = false
  userFrom.userName = row.userName
  userFrom.userId = row.userId
  userFrom.deptId = row.deptId
  userFrom.postId = row.postId
  if (row.status == 'true') {
    userFrom.status = ref(true)
  } else {
    userFrom.status = ref(false)
  }
  userFrom.sex = row.sex
  userFrom.idCard = row.idCard
  userFrom.email = row.email
  userFrom.addres = row.addres
  userFrom.phonenumber = row.phonenumber
  userFrom.userPosition = row.userPosition
  userFrom.remark = row.remark
  userFrom.avatar = row.avatar
  console.log(row, "ss");

  changed(row.deptId)
}

//点击详细按钮，内容添加到弹出框
const handleInfo = (index: number, row: any) => {
  dialogFormVisible.value = true
  infoFlag.value = true
  userFrom.userName = row.userName
  userFrom.userId = row.userId
  userFrom.deptId = row.deptId
  userFrom.postId = row.postId
  if (row.status == 'true') {
    userFrom.status = ref(true)
  } else {
    userFrom.status = ref(false)
  }
  userFrom.sex = row.sex
  userFrom.idCard = row.idCard
  userFrom.email = row.email
  userFrom.addres = row.addres
  userFrom.phonenumber = row.phonenumber
  userFrom.userPosition = row.userPosition
  userFrom.remark = row.remark
  userFrom.avatar = row.avatar
  console.log(row, "ss");

  changed(row.deptId)
}

//添加
const addUser = () => {
  dialogFormVisible.value = true
  infoFlag.value = false
  userFrom.userName = undefined
  userFrom.userId = undefined
  userFrom.deptId = ""
  userFrom.postId = ""
  userFrom.status = 'true'
  userFrom.sex = ""
  userFrom.idCard = ""
  userFrom.email = ""
  userFrom.addres = ''
  userFrom.phonenumber = undefined
  userFrom.userPosition = ''
  userFrom.avatar = state.squareUrl
}

const handleDelete = (row: any) => {
  proxy.$msgbox.confirm('确认要删除' + '"' + row.userName + '"用户吗?').then(function () {
    deleteUserAPI({ userId: row.userId }).then((res: any) => {
      getList()
    });
  }).then(() => {
    proxy.$message.success("删除成功");
    dialogFormVisible.value = false

  }).catch(function () {

  });

  console.log(row);
}

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    //添加

    console.log(userFrom);

    if (valid && userFrom.userId == undefined) {
      insertUserAPI(userFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('添加成功')
        getList()
      });
    } else if (valid && userFrom.userId) {
      //修改信息
      console.log(userFrom, fields)
      updateUserAPI(userFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('修改成功')
        getList()
      });

    } else {
      console.log('error');
      proxy.$message.error('出现异常')
    }

  })
}

/** 用户状态修改  */
function handleStatusChange(row: any) {
  let text = row.status == "true" ? "启用" : "停用";
  proxy.$msgbox.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
    updateUserAPI({ userId: row.userId, status: row.status }).then((res: any) => {
      getList()
    });
  }).then(() => {
    proxy.$message.success(text + "成功");
    dialogFormVisible.value = false
  }).catch(function () {
    console.log(row.status, "bbb");
    row.status = row.status == "true" ? "false" : "true";
  });
  console.log(row);

};


//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogFormVisible.value = false

}

getList()

const dataTree: Tree[] = [
  {
    id: '1',
    label: import.meta.env.VITE_COMPANY_TITLE,
    children: info
  },
]


</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>


<style>
form,
.el-form {
  width: 100%;
  margin: 0 auto;
}
</style>