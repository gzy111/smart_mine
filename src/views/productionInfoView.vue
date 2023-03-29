<template>

<el-upload 
:action="uploadUrl"
    list-type="picture-card" 
    v-model:file-list="info"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload"
    show-file-list
    accept=".pdf,.doc,.docx,.xls,.xlsx"
>
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.img" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span> 
          
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>

  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, toRaw, getCurrentInstance ,toRefs} from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import{DocumentListAPI,DocumentDownAPI,DocumentDeleteAPI} from '../api/upload'
import type { UploadFile } from 'element-plus'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { fi } from 'element-plus/es/locale'


const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/File/UploadImage')
const { proxy } = getCurrentInstance()
const dlist=ref([])
const info=ref([])
const disabled = ref(false)


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
          url:'',
          img:'',
          id:'',
        })
        if(imgFlg(res.data.list[key].type)=='null'){
          re.img=import.meta.env.VITE_APP_BASE_API +res.data.list[key].documentUrl
        }else{
          re.img=imgFlg(res.data.list[key].type)
        }
        re.url=res.data.list[key].documentUrl
        re.name=res.data.list[key].documentName
        re.id=res.data.list[key].id
        info.value.push(re)
    }
  });
}

console.log(info);

documentList()


  // 上传成功后的处理
const handleUploadSuccess = (response:any,file: File) => {
  console.log(file,"bbbb");
  let re=reactive({
          name:'',
          url:'',
          img:'',
          id:'',
        })
          re.img=imgFlg(file.type)
        re.url=file.response
        re.name=file.name
        // todo
        // re.id=res.data.list[key].id
        // info.value.push(re)
  proxy.$message.success('上传成功')
  console.log(response,"sss");
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
  dialogImageUrl.value = uploadFile.img!
  dialogVisible.value = true
}
const handleRemove = (file: UploadFile) => {
  DocumentDeleteAPI({file:file.url,id:file.id}).then((res:any)=>{
    proxy.$message.success('删除成功')
  })
  console.log(file)
}

function imgFlg(tag: string) {
  if(tag=='application/pdf'){
          return'src/style/image/pdf.png'
        }else if(tag=='application/msword' || tag=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
          return'src/style/image/word.png'
        }else if(tag=='application/vnd.ms-excel' || tag=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          return'src/style/image/exce.png'
        }else{
          return 'null'
        }
}

//下载
const handleDownload = (file: UploadFile) => {
  DocumentDownAPI({file:file.url}).then((res:any)=>{
     // alert("请求成功");
     console.log(res.data); // 获取服务端提供的数据
        let blob = new Blob([res.data])
        let contentDisposition = res.headers['content-disposition']
        let pattern = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
        let result = pattern.exec(contentDisposition)
        // 使用decodeURI对名字进行解码
        // let fileName = decodeURI(result[1])
        let downloadElement = document.createElement('a')
        // 创建下载的链接
        let href = window.URL.createObjectURL(blob)
        downloadElement.style.display = 'none'
        downloadElement.href = href
        // 下载后文件名
        downloadElement.download = file.name
        document.body.appendChild(downloadElement)
        // 点击下载
        downloadElement.click()
        // 下载完成移除元素
        document.body.removeChild(downloadElement)
        // 释放掉blob对象
        window.URL.revokeObjectURL(href)
    
  })
  console.log(file)
}
</script>
