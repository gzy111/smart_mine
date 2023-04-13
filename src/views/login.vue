<template>
<!--获取cookie  -->
<div id="max">
    <div id="card">
        <div id="card_left">
        </div>
        <div id="card_right" style="text-align: center">
            <form method="get">
                <div class="form-group" >
                    <label for="exampleInputEmail1">请输入账号:</label>
                    <input type="text" class="form-control" v-model="loginName" id="exampleInputEmail1"
                           aria-describedby="emailHelp">
                    <small id="emailHelp" class="form-text text-muted"></small>
                </div>
                <div class="form-group" v-show="!adminFlg">
                    <label for="exampleInputPassword1">请输入密码:</label>
                    <input type="password" class="form-control" v-model="loginPassword" id="exampleInputPassword1">
                </div>
                <div class="form-group" v-show="adminFlg">
                    <label for="exampleInputPassword1">请输入验证码:</label>
                    <input type="password" class="form-control" v-model="passCode" id="exampleInputPassword1">
                </div>

                <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="adminFlg">
                    <label class="form-check-label" for="exampleCheck1">管理员</label>
                </div>
                <button class="btn btn-primary" @click="submit">登陆</button>
                <button class="btn btn-primary" v-show="adminFlg" @click="getSMCode" :disabled="disabled">获取验证码</button>
            </form>

        </div>
    </div>
</div>


</template>
<script setup lang="ts">
import { computed, ref, reactive, toRaw, getCurrentInstance, toRefs } from 'vue'
import{login,getCode} from '../api/loginAPI'
import router from '../router';
import { Timer } from '@element-plus/icons-vue';
const loginName=ref('')
const loginPassword=ref('')
const adminFlg=ref('')
const passCode=ref('')
const disabled=ref(false);
const loginReq=reactive({
    userId:'',
    password:'',
    adminFlg:'',
    passCode:''
})



const submit=(()=>{
        loginReq.userId=loginName.value
        loginReq.adminFlg=adminFlg.value
        loginReq.password=loginPassword.value
        loginReq.passCode=passCode.value
        login(loginReq).then((res: any) => {
            let userinfo=res.data.data;
            console.log(res.data.data);
            if(res.data.code=200){
                sessionStorage.setItem("userinfo",JSON.stringify(userinfo))
            sessionStorage.setItem("token",res.data.token)
                router.push("/")
            }
        })

})

const getSMCode=(()=>{
    disabled.value=true
    getCode({userId:loginName.value}).then(()=>{
        
    })
    setTimeout(function(){
        disabled.value=false
        console.log("time");
        
    },60*1000)
    // disabled.value=false
})



</script>


<style>
    *{
        margin: 0;
        padding: 0;
    }
    body{

    }
    .btn{
        margin-left: 15px;
        margin-right: 15px;
    }
    #max{
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(to left top, #008e9b, #009ba3, #00a8aa, #07b5af, #1fc2b3, #4ecaae, #6dd2a9, #89d9a6, #b0dda2, #d0e0a6, #eae4b1, #fee8c1);
    }
    a{
        text-decoration-line: none;
        color: #ffffff;
    }
    a:hover{
        color: #ffffff;
    }
    #card{
        position: absolute;
        width: 50%;
        height: 60%;
        margin: auto 0;
        /* border: 1px solid red; */
        background-color: #fff;
        opacity: 0.8;
        border-radius: 12px;
        box-shadow: 0px 4px 20px 2px rgb(97, 94, 94);
    }
    #card_left{
        position: absolute;
        width: 60%;
        height: 100%;

        /* background-color: aquamarine; */
        background: url(../style/image/涠洲岛幕崖.jpg);
        background-size: cover;
    }
    #card_right{
        position: absolute;
        right: 0;
        width: 40%;
        height: 100%;

        background-color: rgb(160, 212, 195);
    }
    form{
        width: 70%;
        margin: 30% auto;
        text-align: center;
    }

    a{
        text-decoration: none;
        color: #ffffff;
    }
    a:hover{
        color: #ffffff;
    }

</style>