<template>
  <el-upload
    v-model:file-list="info"
    :action="uploadUrl"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { computed, ref, reactive, toRaw, getCurrentInstance ,toRefs} from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import{DocumentListAPI,DocumentDownAPI} from '../api/upload'

const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/File/UploadImage')
const { proxy } = getCurrentInstance()
const dlist=ref([])
const info=ref([])



const beforeUpload = (file: File) => {
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



function documentList() {
  DocumentListAPI({}).then((res: any) => {
    console.log(res);
    for (const key in res.data.list) {
        let re=reactive({
          name:'',
          url:''
        })
        if(res.data.list[key].type=='application/pdf'){
          re.url='src/style/image/pdf.png'
        }else if(res.data.list[key].type=='application/msword' || res.data.list[key].type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
          re.url='src/style/image/word.png'
        }else if(res.data.list[key].type=='application/vnd.ms-excel' || res.data.list[key].type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          re.url='src/style/image/exce.png'
        }else{
          re.url=import.meta.env.VITE_APP_BASE_API +res.data.list[key].documentUrl
        }
        re.name=import.meta.env.VITE_APP_BASE_API +res.data.list[key].documentName
        info.value.push(re)
    }
  });
}

console.log(info);

documentList()

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-1.png',
    url: 'src/style/image/exce.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-2.png',
    url: '/images/plant-2.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-1.png',
    url: '/images/figure-1.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-2.png',
    url: '/images/figure-2.png',
  },
])

const handleUploadSuccess = (response:any) => {
  // 上传成功后的处理
  proxy.$message.success('上传成功')
  console.log(response);
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>
