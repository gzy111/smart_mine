<template>
  <el-row :gutter="20">
    <el-col :span="4" :xs="24">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
    </el-col>
    <el-col :span="20" :xs="24">
      <el-row class="mb-4">
        <el-button @click="addPost()">
          新增岗位
        </el-button>
      </el-row>
      <el-table :data="postList" style="width: 100%" v-loading="loading">
        <el-table-column prop="postId" label="岗位id" width="150" />
        <el-table-column prop="postCode" label="岗位编码" width="150" />
        <el-table-column prop="dept.deptName" label="部门名称" width="150" />
        <el-table-column prop="postName" label="岗位名称" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="200" />
        <el-table-column prop="updateTime" label="更新时间" width="200" />
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
      <el-pagination :page-size=queryParams.pageNum :page-count="total" layout="prev, pager, next,total,jumper"
        :total="total" v-model:current-page="queryParams.pageNum" @current-change="handleCurrentChange" />

    </el-col>

  </el-row>

  <!-- ---------------------------弹窗 ------------------------------------------------------------>
  <el-dialog v-model="dialogFormVisible" :title="PostFrom.postId ? '编辑岗位' : '新增岗位'" destroy-on-close width="30%"
    :align-center="true" :center="true" :close-text="'关闭'" :confirm-button-text="'确认'">
    <div class="dialog-container">
      <el-form :model="PostFrom" ref="ruleFormRef" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位ID">
              <el-input v-model="PostFrom.postId" :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="岗位名称">
              <el-input v-model="PostFrom.postName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="部门">
          <el-select v-model="PostFrom.deptId" placeholder="请选择部门" filterable>
            <el-option v-for="item in toRaw(deptList)" :key="item" :label="item.deptName" :value="item.deptId" />
          </el-select>

        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="PostFrom.status" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="PostFrom.remark" type="textarea" />
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
import { reactive, ref, toRefs, toRaw, getCurrentInstance } from 'vue';
import { DeptSelectAllAPI, DeptTree } from "../api/deptAPI"
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, ElMessage } from 'element-plus'
import { PostSelectAPI, PostDeleteAPI, PostInsetAPI, PostUpdateAPI } from '../api/postAPI'
interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const ruleFormRef = ref<FormInstance>()
const info = ref([])
const postList = ref()
const deptList = ref()
const tableData = ref([])
const { proxy } = getCurrentInstance()
const dialogFormVisible = ref(false)
const loading = ref(false)
const PostFrom = reactive({
  postId: undefined,
  postName: undefined,
  postCode: '',
  deptId: '',
  createTime: '',
  createBy: '',
  updateTime: '',
  remark: '',
  status: '',
})

//传参
const datas = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    postId: '',
    deptId: ''
  },
});
const total = ref()
const { queryParams } = toRefs(datas);

//查询所有部门
DeptSelectAllAPI({}).then((res: any) => {
  for (const key in res.data) {
    let re = reactive({
      id: '',
      label: ''
    })
    re.id = res.data[key].deptId
    re.label = res.data[key].deptName
    info.value.push(re)
  }
  deptList.value = res.data
});

//树状结构
const handleNodeClick = (data: Tree) => {
  if (data.id != '1') {
    queryParams.value.deptId = data.id
  } else {
    queryParams.value.deptId = ''
  }

  getPostList()
}

const data: Tree[] = [
  {
    id: '1',
    label: import.meta.env.VITE_COMPANY_TITLE,
    children: info.value
  },

]
const defaultProps = {
  children: 'children',
  label: 'label',
}

//获取岗位
function getPostList() {
  PostSelectAPI(queryParams.value).then((res: any) => {
    postList.value = res.data.list
    total.value = res.data.pages
    console.log(postList, "post");
  });
}

//点击编辑按钮，内容添加到弹出框
const handleEdit = (index: number, row: any) => {
  dialogFormVisible.value = true
  PostFrom.postId = row.postId
  PostFrom.deptId = row.deptId
  PostFrom.postName = row.postName
  if (row.status == 'true') {
    PostFrom.status = ref(true)
  } else {
    PostFrom.status = ref(false)
  }
  PostFrom.postCode = row.postCode
  PostFrom.updateTime = row.updateTime
  PostFrom.createTime = row.createTime
  PostFrom.remark = row.remark
  console.log(row, "ss");
}
//删除
const handleDelete = (row: any) => {
  proxy.$msgbox.confirm('确认要删除' + '"' + row.deptName + '"部门吗?').then(function () {
    PostDeleteAPI({ deptId: row.deptId }).then((res: any) => {
      getPostList()
    });
  }).then(() => {
    proxy.$message.success("删除成功");
  }).catch(function () {

  });

  console.log(row);
}

//提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    //添加
    if (valid && PostFrom.postId == undefined) {
      PostInsetAPI(PostFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('添加成功')
        getPostList() //更新数据
      });
    } else if (valid && PostFrom.postId) {
      //修改信息
      PostUpdateAPI(PostFrom).then((res: any) => {
        dialogFormVisible.value = false
        proxy.$message.success('修改成功')
        getPostList() //更新数据
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

//分页
const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val
  getPostList()
}

/** 岗位状态修改  */
function handleStatusChange(row: any) {
  let text = row.status == "true" ? "启用" : "停用";
  proxy.$msgbox.confirm('确认要"' + text + '""' + row.postName + '"岗位吗?').then(function () {
    console.log(row, "sss");
    PostUpdateAPI({ postId: row.postId, status: row.status }).then((res: any) => {
      getPostList()
    });

  }).then(() => {
    proxy.$message.success(text + "成功");
  }).catch(function () {
    row.status = row.status == "true" ? "false" : "true";
  });
};

//新增部门
const addPost = () => {
  dialogFormVisible.value = true
  PostFrom.postId = undefined
  PostFrom.postName = undefined
  PostFrom.postCode = ''
  PostFrom.deptId = ''
  PostFrom.createTime = ''
  PostFrom.createBy = ''
  PostFrom.updateTime = ''
  PostFrom.remark = ''
  PostFrom.status = ''
}

getPostList()
</script>
  