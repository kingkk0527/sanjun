<template>
  <div class="login">
    <div class="login-box">
      <img src="../../assets/登录背景.jpeg" alt="">
      <div class="login-form">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <div class="login-form-title">
            <span class="title-label">欢迎登录医院后台系统</span>
          </div>
          <el-form-item prop="userName">
            <el-input
              v-model="loginForm.userName"
              type="text"
              auto-complete="off"
              placeholder="账号"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-form-item style="display: flex; gap: 20px; margin-top: 30px;">
            <el-button
              class="login-btn"
              type="primary"
              style="flex: 1;"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>

            <el-button
              class="register-btn"
              type="primary"
              style="flex: 1;"
              @click.native.prevent="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { Form as ElForm, Input, Message } from 'element-ui';
import { UserModule } from '@/store/modules/user';
import { isValidUsername } from '@/utils/validate';

@Component({
  name: 'Login'
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('请输入用户名'));
    } else {
      callback();
    }
  }
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码必须在6位以上'));
    } else {
      callback();
    }
  }
  private loginForm = {
    userName: '',
    password: ''
  } as {
    userName: String
    password: String
  }

  loginRules = {
    userName: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }
  private loading = false
  private redirect?: string

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {}
  // 登录
  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true;
        await UserModule.Login(this.loginForm as any)
          .then((res: any) => {
            if (String(res.code) === '1') {
              // 登录成功，跳转到系统首页
              this.$router.push('/');
            } else {
              // this.$message.error(res.msg)
              this.loading = false;
            }
          })
          .catch(() => {
            // this.$message.error('用户名或密码错误！')
            this.loading = false;
          });
      } else {
        return false;
      }
    });
  }
  // 注册
  private handleRegister() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.$router.push('/register');
      } else {
        return false;
      }
    });
  }
}
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-color: #9cffb2;
  img {
    width: 100%;
    height: 100%;
  }
}

.login-box {
  width: 100%;
  height: 100%;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  margin: 0px auto 10px auto;
  text-align: left;
  color: #0abd55;
}

.login-form {
  background: #f8e9cf; // 背景颜色
  display: flex;
  width: 430px; // 使用视口单位
  height: 400px; //
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; // 使用绝对定位
  top: 50%; // 垂直居中
  left: 50%; // 水平居中
  transform: translate(-50%, -50%); // 精确居中
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); // 添加阴影效果
  font-size: calc(12px + 0.5vw); // 字体大小随视口变化

  .el-form {
    width: 50%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center; // 垂直居中
    align-items: center; // 水平居中

  }
  .el-form-item {

    width: 100%; // 使表单项占满父容器宽度
    margin-bottom: 20px;
    display: flex;
    justify-content: center; // 水平居中
    margin-bottom: calc(10px + 1vh); // 间距随视口变化
  }
  .el-form-item.is-error .el-input__inner {
    border: 0 !important;
    border-bottom: 1px solid #fd7065 !important;
    background: #fff !important;
  }
  .input-icon {
    height: 32px;
    width: 18px;
    margin-left: -2px;
  }
  .el-input__inner {
    border: 1px solid #dcdfe6; // 添加边框
    border-radius: 4px; // 添加圆角
    padding: 0 15px; // 调整内边距
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    height: 40px; // 适当增加高度
    line-height: 40px;
    transition: border-color 0.2s ease-in-out; // 添加过渡效果
    &:focus {
      border-color: #ffc200; // 聚焦时改变边框颜色
      outline: none;
    }
  }
  .el-input__prefix {
    left: 0;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 26px;
  }
  .el-input__inner::placeholder {
    color: #aeb5c4;
  }
  .el-form-item--medium .el-form-item__content {
    line-height: 32px;
  }
  .el-input--medium .el-input__icon {
    line-height: 32px;
  }
}

.login-btn  {
  border-radius: 17px;
  padding: 11px 20px !important;
  margin-top: 10px;
  font-weight: 500;
  font-size: 12px;
  border: 0;
  font-weight: 500;
  color: #333333;
  // background: #09a57a;
  background-color: #ffc200;
  &:hover,
  &:focus {
    // background: #09a57a;
    background-color: #ffc200;
    color: #ffffff;
  }
}
.register-btn {
  border-radius: 17px; // 圆角
  padding: 11px 20px !important;  // 长宽
  margin-top: 10px;
  font-weight: 500;
  font-size: 12px;
  border: 0;
  font-weight: 500;
  color: #333333;
  background-color: #ffc200;
  &:hover,
  &:focus {
    background-color: #ffc200;
    color: #ffffff;
  }
}
.login-form-title {

  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  .title-label {
    font-weight: 500;
    font-size: 20px;
    color: #333333;
    margin-left: 10px;
  }
}
</style>
