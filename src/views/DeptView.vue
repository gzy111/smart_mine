<template>
  <el-input v-model="filterText" placeholder="Filter keyword" />

  <el-tree
    ref="treeRef"
    class="filter-tree"
    :data="data"
    :props="defaultProps"
    default-expand-all
    :filter-node-method="filterNode"
  />
</template>

<script lang="ts" setup>
import { ref, watch ,toRaw , toRef,reactive,} from 'vue'
import { ElTree } from 'element-plus'
import{DeptSelectAllAPI} from "../api/deptAPI"
import{PostSelectAllAPI} from "../api/postAPI"
import { da } from 'element-plus/es/locale';

interface Tree {
  id: number
  label: string
  children?: Tree[]
}


const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'children',
  label: 'label',
}

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

const deptTree = reactive({
  id: '',
  label: '',
  children : []
})


const DeptInfo=ref<Dept>()

function DeptInfoList(){
  DeptSelectAllAPI({ }).then((res: any) => {
    DeptInfo.value = res.data.list    
    console.log(DeptInfo);
    
  });
}
DeptInfoList()

var key :(keyof Dept);
for(key in DeptInfo){
  console.log((DeptInfo as any)[key]);
  
}

const data: Tree[] = [
  {
    id: 1,
    label: import.meta.env.VITE_COMPANY_TITLE,
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
]


for (var dept in  DeptInfo.value){
    console.log(dept);
    
}
</script>
