<template>
  <div id="login">
    <div class="login_container_box">
      <!-- logo -->
      <div class="login_logo">
        <img src="~assets/image/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <div class="login_from">
        <!-- 
          rules表单验证对象
          model表单数据对象
         -->
        <el-form ref="loginForm" :rules="loginForm" :model="loginform" class="" label-width="80px">
          <el-form-item prop="userid" label="账号：">
            <el-input placeholder="请输入账号" v-model="loginform.userid"></el-input>
          </el-form-item>
          <el-form-item prop="userpwd" label="密码：">
            <el-input placeholder="请输入密码" v-model="loginform.userpwd" show-password></el-input>
          </el-form-item>
          <div class="login_from_btn">
            <el-button @click="submitBtn" type="primary">登录</el-button>
            <el-button @click="clearForm" type="info">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogin } from "network/login";

export default {
  name: "Login",
  data () {
    return {
      // 表单数据对象
      loginform: {
        userid: 'admin',  // 账号
        userpwd: '123456',  // 密码
      },
      // 表单验证对象
      loginForm: {
        userid: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        userpwd: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 重置按钮
    clearForm(){
      // 通过 refs 拿到form表单对象  调用resetFields清空内容
      this.$refs.loginForm.resetFields()
    },

    // 登录按钮
    submitBtn(){
      // 调用 validate 方法进行表单验证
      this.$refs.loginForm.validate( valid => {
        if (valid) {
          getLogin(this.loginform.userid, this.loginform.userpwd).then(res => {
            if (res.data.meta.status != 200) {
              this.$message.error("账号或者密码错误");
              return;
            }
            this.$message.success("登录成功！");
            window.sessionStorage.setItem("token", res.data.data.token)   // 保存到本地当中
            this.$router.push("/managementView")   // 路由跳转
          })
        }
      })
    }
  }
}

</script>
<style scoped>
  #login {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgb(105, 225, 247);
  }
  .bgcImg{
    filter: blur(15px);
    transform: scale(1.1);
  }
  .bgcImg img {
    width: 100%;
    height: 100%;
  }
  .login_container_box{
    width: 500px;
    height: 320px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
  .login_logo{
    width: 33%;
    height: 50%;
    position: relative;
    z-index: 10;
    border-radius: 50%;
    background-color: #fff;
    overflow: hidden;
    margin: -10% auto 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  .login_logo img{
    width: 100%;
    height: 100%;
    position: relative;
    top: -6px;
  }
  .login_from{
    width: 80%;
    margin: 20px auto 0;
  }
  .login_from_btn{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>