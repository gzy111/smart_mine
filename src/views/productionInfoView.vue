<template>
  <el-upload :action="uploadUrl" list-type="picture-card" v-model:file-list="info" :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove" :on-success="handleUploadSuccess" :before-upload="beforeUpload"
    accept=".pdf,.doc,.docx,.xls,.xlsx" :show-file-list="false">
    <el-icon>
      <Plus />
    </el-icon>
    <!-- <template v-for="(file, index) in info" >
      
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
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
  -->
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
  </div>  
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
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
  const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
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
    for (const key in res.data.list) {
      let re = reactive({
        name: '',
        url: '',
        img: '',
        id: '',
        dUrl: ''
      })
      if (imgFlg(res.data.list[key].type) == 'null') {
        re.url = import.meta.env.VITE_APP_BASE_API + res.data.list[key].documentUrl
      } else {
        re.url = imgFlg(res.data.list[key].type)
      }
      re.dUrl = res.data.list[key].documentUrl
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
    dUrl: '',
  })
  re.url = imgFlg(response.type)
  re.id = response.id
  re.name = response.documentName
  re.id = response.documentUrl

  info.value.push(re)
  proxy.$message.success('上传成功')

}


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

//放大
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  // 判断上传的文件是否为图片类型
  if (uploadFile.type.indexOf('image') === 0) {
    dialogVisible.value = true
    dialogImageUrl.value = uploadFile.img
  } else {
    return null;
  }
  // dialogImageUrl.value = uploadFile.img

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

.card{
  padding: 0;
  height: 130px;
  width: 130px;
  background-color: rgb(232, 232, 233);
  border-radius: 5px 5px ;
}
.card img{
  height: 100%;
  width: 100%;
}
.big-card{
  position: relative;
  height: 160px;
  width: 130px;
  background-color: rgb(114, 93, 52);
}
.card-title{
  font-size:14px;
  background-color: aqua;
  width: 130px;
}

.branch_name_front {
    display: block;
    text-align: justify;
    overflow: hidden;
    height: 20px;
    white-space: normal;
}
.branch_name_front::before{
    content: attr(title);
    width: 60%;
    float: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    direction: rtl;
}
.doc-menu{
  float: left; 
  width: 100%;
  height: 100%;
  position: relative;
}

</style>