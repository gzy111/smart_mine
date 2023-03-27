<template>
  <el-upload :action="uploadUrl" :on-success="handleUploadSuccess" :before-upload="beforeUpload" :headers="headers"
    :data="uploadData" :multiple="false" :file-list="fileList">
    <el-button type="primary">点击上传</el-button>
  </el-upload>
  <div style="height: 200px;width: 200px;display: block;background-color: aqua;">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
  </div>


  <el-upload
  :action="uploadUrl"
  :on-success="handleUploadSuccess"
  :before-upload="beforeUpload2"
  :headers="headers"
  :data="uploadData"
  :multiple="false"
  :file-list="fileList"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  show-file-list
  list-type="picture-card"
>
  <i class="el-icon-plus"></i>
  <div class="upload-text">上传文件</div>

</el-upload>
</template>

<script lang="ts" setup >
import { computed, ref, reactive, toRaw, getCurrentInstance } from 'vue'
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/File/UploadImage')
const imageUrl = ref('http://127.0.0.1:80/2023-03-27/房屋出租.jpg')
const fileUrl=ref('')
const { proxy } = getCurrentInstance()
const beforeUpload = (file) => {
  // 对上传的文件进行验证
  const isJpg = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJpg) {
    proxy.$message.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    proxy.$message.error('上传头像图片大小不能超过 2MB!')
  }
  return isJpg && isLt2M
}
const handleUploadSuccess = (response) => {
  // 上传成功后的处理
  proxy.$message.success('上传成功')
  console.log(response);
  imageUrl.value = response

}

const beforeUpload2 = (file: File) => {
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
const handleUploadSuccess2 = (response) => {
  // 上传成功后的处理
  proxy.$message.success('上传成功')
  console.log(response);
  fileUrl.value = response
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