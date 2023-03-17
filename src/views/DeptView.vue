<template>
  <el-row :gutter="20">
    <el-col :span="4" :xs="24">
  <el-input v-model="filterText" placeholder="Filter keyword" />

  <el-tree
    ref="treeRef"
    class="filter-tree"
    :data="dataTree"
    :props="defaultProps"
    default-expand-all
    :filter-node-method="filterNode"
    @node-click="handleNodeClick"
  />
</el-col>

<el-col :span="20" :xs="24">
  <el-table :data="userList" style="width: 100%" v-loading="loading">
    <el-table-column prop="userId" label="用户id" width="100" />
    <el-table-column prop="userName" label="姓名" width="100" />
    <el-table-column prop="sex" label="性别" width="100"/>
    <el-table-column prop="phonenumber" label="手机" width="150"/>
    <el-table-column prop="dept.deptName" label="部门" width="100"/>
    <el-table-column prop="post.postName" label="岗位" width="100" />
    <el-table-column prop="userPosition" label="位置" width="150" />
    <el-table-column prop="status" label="状态" />
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="" :icon="Edit" ></el-button>
        <el-button size="small" type="danger" @click="" :icon="Delete"></el-button>
        <el-button size="small"  @click="" :icon="User"></el-button>
      </template>
    </el-table-column>
  </el-table>
</el-col>
</el-row>
</template>

<script lang="ts" setup>
import { ref, watch ,toRaw , toRef,reactive,toRefs,getCurrentInstance} from 'vue'
import { ElTree } from 'element-plus'
import{DeptSelectAllAPI,DeptTree} from "../api/deptAPI"
import{userSelectPageAPI} from "../api/userAPI"
import { Delete, Edit, Search, Share, Upload, User } from '@element-plus/icons-vue'
import { da } from 'element-plus/es/locale';

interface Tree {
  id: string
  label: string
  children?: Tree[]
}
const filterText = ref('')
const loading = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const userList = ref([])
const total = ref(0)
const defaultProps = {
  children: 'children',
  label: 'label',
}

const { proxy } = getCurrentInstance()
const datas = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: undefined,
    postId: undefined,
  },
});
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
  if(str.substring(0,1)=='P'){
    console.log("p");
    queryParams.value.deptId=Number(str.substring(1,4))
    queryParams.value.postId=Number(str.substring(4,7))
    console.log(queryParams.value);
    getList()
  }else if(str.substring(1,4)!=''){
    queryParams.value.deptId=str
    console.log(str,"str");
    queryParams.value.postId=undefined;
    getList()
  }else{
    queryParams.value.deptId=undefined;
    queryParams.value.postId=undefined;
    getList()
  }
}

const info=ref(undefined)

//树形结构
DeptTree({}).then((res: any) => {
  // console.log(res);
  info.value=res.data
  });


  /** 查询用户列表 */
function getList() {
  loading.value = true;
  userSelectPageAPI(queryParams.value).then(res => {
   
    console.log(res.data.list);
    console.log(queryParams.value,"query");
    userList.value = res.data.list;
    // total.value = res.data.data.pages
    loading.value = false;
  });
};
getList()

const dataTree: Tree[] = [
  {
    id: '1',
    label: import.meta.env.VITE_COMPANY_TITLE,
    children: info
  },
]


</script>
