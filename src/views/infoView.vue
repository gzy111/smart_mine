<template>

<div class="big-card">


<div class="card">
  <img src="../style/image/exce.png" alt="">
</div>
<div class="card-title">
  <span
 title="ss" 
 class="branch_name_front
 ">
 CSS 测试标题，这是一个稍微有点长的标题，超出一行以后才会有title提示，标题是 实现优惠券的技巧 - 2021-03-26
 </span>

</div>

</div>
</template>
<script lang="ts" setup >

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

</style>