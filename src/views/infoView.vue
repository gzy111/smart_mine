<template>
  <el-upload :action="uploadUrl" list-type="picture-card" v-model:file-list="info" :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove" :on-success="handleUploadSuccess" :before-upload="beforeUpload"
    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" :show-file-list="true">
    <el-icon>
      <Plus />
    </el-icon>
    <template #file="{ file }" #tip="ssss" >
      <div style="width: 100%;">
        <img class="el-upload-list__item-thumbnail" :src="file.img" style="height: 80%;" alt="" />
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
        <!-- <div style="height: 20%;">
          <span
            :title="file.name" 
            class=".ellipsis">
            {{ file.name }}
            </span>
        </div> -->
        <div slot="tip">
          {{ file.name }}
        </div>
      </div>
    </template>
<!--  
    <div class="doc-menu">
  <template v-for="(file, index) in info" :key="file">
      <div class="big-card">
        <div class="card">
          <img :src="file.url" alt="">
        </div>
        <div class="card-title">
          <span title="CSS 测试标题，这是一个稍微有点长的标题，超出一行以后才会有title提示，标题是 实现优惠券的技巧 - 2021-03-26" class="branch_name_front">
            CSS 测试标题，这是一个稍微有点长的标题，超出一行以后才会有title提示，标题是 实现优惠券的技巧 - 2021-03-26
          </span>
        </div>
      </div>
    </template>
  </div>   -->
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
    <div>
      <span>
        {{ dialogFileName }}
      </span>
    </div>
  </el-dialog>
</template> 

<script lang="ts" setup>
import { computed, ref, reactive, toRaw, getCurrentInstance, toRefs } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { DocumentListAPI, DocumentDownAPI, DocumentDeleteAPI } from '../api/upload'
import type { UploadFile } from 'element-plus'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { fi } from 'element-plus/es/locale'


const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/File/UploadFile')
const { proxy } = getCurrentInstance()
const dlist = ref([])
const info = ref([])
const disabled = ref(false)


const beforeUpload = (file: File) => {
  const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/jpeg','image/png']
  const fileType = file.type
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!fileTypes.includes(fileType)) {
    proxy.$message.error('上传文件只能是 PDF、Word 或 Excel 格式!')
  }
  if (!isLt2M) {
    proxy.$message.error('上传文件大小不能超过 10MB!')
  }
  return fileTypes.includes(fileType) && isLt2M
}


//获取文件列表
function documentList() {
  DocumentListAPI({}).then((res: any) => {
    console.log(res);
    // info.value=[]
    for (const key in res.data.list) {
      let re = reactive({
        name: '',
        url: '',
        img: '',
        id: '',
      })
      if (imgFlg(res.data.list[key].type) == 'null') {
        re.img = import.meta.env.VITE_APP_BASE_API + res.data.list[key].documentUrl
      } else {
        re.img = imgFlg(res.data.list[key].type)
      }
      re.url = res.data.list[key].documentUrl
      re.name = res.data.list[key].documentName
      re.id = res.data.list[key].id
      info.value.push(re)
    }
  });

}

console.log(info, "info");
documentList()

// 上传成功后的处理
const handleUploadSuccess = (response: any) => {
  let re = reactive({
    name: '',
    url: '',
    img: '',
    id: '',
  })
  if(response.code==403){
    console.log(info.value.pop())
    return   proxy.$message.error(response.msg)
  }
  console.log(response,"re");
  
  response=response.data
  const fileType = response.type
  if (fileType === 'application/pdf') {
    // 处理 PDF 文件的逻辑
    re.img = imgFlg(response.type)
    re.id = response.id
    re.name = response.documentName
    re.url = response.documentUrl
  } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // 处理 Word 文件的逻辑
    re.img = imgFlg(response.type)
    re.id = response.id
    re.name = response.documentName
    re.url = response.documentUrl
  } else if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    // 处理 Excel 文件的逻辑
    re.img = imgFlg(response.type)
    re.id = response.id
    re.name = response.documentName
    re.url = response.documentUrl
  } else if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif') {
    re.id = response.id
    re.name = response.documentName
    re.url = response.documentUrl
    re.img=import.meta.env.VITE_APP_BASE_API + response.documentUrl
    // 处理图片文件的逻辑
  }
  console.log(info.value.pop())
  info.value.push(re)


  console.log(response,"response");
  console.log(re,"re");
  
  // documentList()
  proxy.$message.success('上传成功')

}


const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const dialogFileName=ref('')
//放大
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile,"up");
  // 判断上传的文件是否为图片类型
    dialogVisible.value = true
    dialogImageUrl.value = uploadFile.img
    dialogFileName.value=uploadFile.name


}
//删除文件
const handleRemove = (file: UploadFile) => {
  DocumentDeleteAPI({ file: file.url, id: file.id }).then((res: any) => {
    for (let item in info.value) {
      if (info.value[item].id == file.id) {
        info.value.splice(item, 1)
      }
    }
    proxy.$message.success('删除成功')
  })

  console.log(info, "info");

}

function imgFlg(tag: string) {
  if (tag == 'application/pdf') {
    return 'src/style/image/pdf.png'
  } else if (tag == 'application/msword' || tag == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'src/style/image/word.png'
  } else if (tag == 'application/vnd.ms-excel' || tag == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return 'src/style/image/exce.png'
  } else {
    return 'null'
  }
}
//下载
const handleDownload = (file: UploadFile) => {
  DocumentDownAPI({ file: file.url }).then((res: any) => {
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

}
</script>
<style>
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  /* 添加以下两行代码，使鼠标移动到省略号处时显示全部文本 */
  position: relative;
  cursor: pointer;
}

.ellipsis:hover:after {
  content: attr(title);
  position: absolute;
  top: 0;
  left: 100%;
  white-space: pre-wrap;
  background-color: #000;
  color: #fff;
  padding: 5px;
}
</style>