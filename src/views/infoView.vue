<template>
  <el-upload
  :action="uploadUrl"
  :on-success="handleUploadSuccess"
  :before-upload="beforeUpload2"
  :multiple="false"
  :file-list="fileList"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  show-file-list
  list-type="picture-card"
>
  <i class="el-icon-plus"></i>
  <div class="upload-text">上传文件</div>
</el-upload>

<template v-for="item in toRefs(dlist)" :key="item">
  <li><a :href="item.value.documentUrl">{{ item.value.id }}</a></li>
</template>
<a href="http://localhost:80/File/download?name=/2023-03-28/附件1.河池市2023年事业单位公开招聘工作人员岗位表2023.3.15.xls">下载</a>
</template>

<script lang="ts" setup >
import { computed, ref, reactive, toRaw, getCurrentInstance ,toRefs} from 'vue'
import{DocumentListAPI,DocumentDownAPI} from '../api/upload'
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/File/UploadImage')

const fileUrl=ref('')
const { proxy } = getCurrentInstance()

const handleUploadSuccess = (response) => {
  // 上传成功后的处理
  proxy.$message.success('上传成功')
  console.log(response);

}

const beforeUpload2 = (file: File) => {
  const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  const fileType = file.type
  const isLt2M = file.size / 1024 / 1024 < 10
  console.log(file);
  
  if (!fileTypes.includes(fileType)) {
    proxy.$message.error('上传文件只能是 PDF、Word 或 Excel 格式!')
  }
  if (!isLt2M) {
    proxy.$message.error('上传文件大小不能超过 10MB!')
  }
  return fileTypes.includes(fileType) && isLt2M
}
const handleUploadSuccess2 = (response) => {
  // 上传成功后的处理
  proxy.$message.success('上传成功')
  console.log(response);
  fileUrl.value = response
}
const dlist=ref([])
const info=ref([])
function documentList() {
  DocumentListAPI({}).then((res: any) => {
    for (const key in res.data) {
        let re=reactive({
            id:'',
            label:''
        })
        re.id=res.data[key].deptId
        re.label=res.data[key].deptName
        info.value.push(re)
    }

  });
}
documentList()
console.log(dlist);

function documentDown() {
  DocumentDownAPI({name:"房屋出租.jpg",isOnline:0}).then((res: any) => {
    console.log(res);
  });
}

</script>
<style>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  background-color: antiquewhite;
}
</style>