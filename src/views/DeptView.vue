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
  />
</el-col>

<el-col :span="20" :xs="24">
  <el-table :data="tableData" style="width: 100%" :loading="loading">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</el-col>
</el-row>
</template>

<script lang="ts" setup>
import { ref, watch ,toRaw , toRef,reactive,toRefs,getCurrentInstance} from 'vue'
import { ElTree } from 'element-plus'
import{DeptSelectAllAPI,DeptTree} from "../api/deptAPI"
import{userSelectPageAPI} from "../api/userAPI"
import { da } from 'element-plus/es/locale';

interface Tree {
  id: number
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
const datas = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined,
    postId: undefined,
  },
  // rules: {
  //   userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
  //   nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  //   password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
  //   email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
  //   phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  // }
});

const { queryParams, form } = toRefs(datas);
const { proxy } = getCurrentInstance()
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

interface Dept{
  deptId:number
  deptName:string
  leader:string
  status:string
}

const DeptInfo=ref<Dept>()
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
    loading.value = false;
    console.log(res.data.list);
    
    // userList.value = res.data;
    // total.value = res.data.data.pages
  });
};
getList()

const dataTree: Tree[] = [
  {
    id: 1,
    label: import.meta.env.VITE_COMPANY_TITLE,
    children: info
  },
]


</script>
