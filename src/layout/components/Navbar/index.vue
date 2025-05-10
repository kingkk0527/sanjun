<template>
  <!--// 横向导航栏-->
  <div class="navbar">
    <div class="statusBox">
      <hamburger id="hamburger-container"
                 :is-active="sidebar.opened"
                 class="hamburger-container"
                 @toggleClick="toggleSideBar"
      />
    </div>

    <div :key="restKey"
         class="right-menu"
    >
      <div class="avatar-wrapper">
        <div :class="shopShow?'userInfo':''"
             @mouseenter="toggleShow"
             @mouseleave="mouseLeaves"
        >
          <el-button type="primary"
                     :class="shopShow?'active':''"
          >
            {{ name }}<i class="el-icon-arrow-down" />
          </el-button>
          <div v-if="shopShow"
               class="userList"
          >
            <p class="amendPwdIcon"
               @click="handlePwd"
            >
              修改密码<i />
            </p>
            <p class="outLogin"
               @click="logout"
            >
              退出登录<i />
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码 -->
    <Password :dialog-form-visible="dialogFormVisible"
              @handleclose="handlePwdClose"
    />
    <!-- end -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import Cookies from 'js-cookie'
import Hamburger from '@/components/Hamburger/index.vue'
import { debounce, throttle } from '@/utils/common'
import { setNewData, getNewData } from '@/utils/cookies'

// 修改密码弹层
import Password from '../components/password.vue'

@Component({
  name: 'Navbar',
  components: {
    Hamburger,
    Password,
  },
})
export default class extends Vue {
  private storeId = this.getStoreId
  private restKey: number = 0
  private websocket = null
  private shopShow = false
  private dialogVisible = false
  private status = 1
  private setStatus = 1
  private dialogFormVisible = false
  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  getuserInfo() {
    return UserModule.userInfo
  }

  get name() {
    return (UserModule.userInfo as any).name
      ? (UserModule.userInfo as any).name
      : JSON.parse(Cookies.get('user_info') as any).name
  }

  get id() {
    return (UserModule.userInfo as any).id
      ? (UserModule.userInfo as any).id
      : JSON.parse(Cookies.get('user_info') as any).id
  }

  get getStoreId() {
    let storeId = ''
    if (UserModule.storeId) {
      storeId = UserModule.storeId
    } else if ((UserModule.userInfo as any).stores != null) {
      storeId = (UserModule.userInfo as any).stores[0].storeId
    }
    return storeId
  }

  created() {
  }

  destroyed() {
    this.websocket.close() //离开路由之后断开websocket连接
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }
  // 退出
  private async logout() {
    this.$store.dispatch('LogOut').then(() => {
      // location.href = '/'
      this.$router.replace({ path: '/login' })
    })
    // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }

   // 下拉菜单显示
  toggleShow() {
    this.shopShow = true
  }
  // 下拉菜单隐藏
  mouseLeaves() {
    this.shopShow = false
  }

  // 修改密码
  handlePwd() {
    this.dialogFormVisible = true
  }
  // 关闭密码编辑弹层
  handlePwdClose() {
    this.dialogFormVisible = false
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  // overflow: hidden;
  position: relative;
  background: #aaaaff;
  //background: #9696ff;

  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .statusBox {
    float: left;
    height: 100%;
    align-items: center;
    display: flex;
  }
  .hamburger-container {
    // line-height: 54px;

    padding: 0 12px 0 20px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    float: right;

    margin-right: 20px;

    color: #333333;
    font-size: 14px;

    span {
      padding: 0 10px;
      width: 130px;
      display: inline-block;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.52);
      }
    }
    .amendPwdIcon {
      i {
        width: 18px;
        height: 18px;
        background: url(./../../../assets/icons/btn_gaimi@2x.png) no-repeat;
        background-size: contain;
        margin-top: 8px;
      }
    }
    .outLogin {
      i {
        width: 18px;
        height: 18px;
        background: url(./../../../assets/icons/btn_close@2x.png) no-repeat 100%
          100%;
        background-size: contain;
        margin-top: 8px;
      }
    }
    .outLogin {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    // .avatar-container {
    // margin-right: 30px;

    // }
  }
  .rightStatus {
    height: 100%;
    line-height: 60px;
    display: flex;
    align-items: center;
    float: left;
  }
  .avatar-wrapper {
    margin-top: 14px;
    margin-left: 18px;
    position: relative;
    // vertical-align: middle;
    float: right;
    width: 120px;
    text-align: left;
    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }

    .el-button--primary {
      // height: 32px;
      background: rgba(255, 255, 255, 0.52);
      border-radius: 4px;
      padding-top: 0px;
      padding-bottom: 0px;
      position: relative;
      // top: -15px;
      width: 120px;
      // padding: 11px 12px 10px;
      padding-left: 12px;
      text-align: left;
      border: 0 none;
      height: 32px;
      line-height: 32px;
      &.active {
        background: rgba(250, 250, 250, 0);
        border: 0 none;
        .el-icon-arrow-down {
          transform: rotate(-180deg);
        }
      }
    }
  }

  .closing {
    background: #6a6a6a;
  }
  .navicon {
    i {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: sub;
      margin: 0 4px 0 0;
    }
  }

  // .el-badge__content.is-fixed {
  //   top: 20px;
  //   right: 6px;
  // }
}
</style>
<style lang="scss">
.el-notification {
  // background: rgba(255, 255, 255, 0.71);
  width: 419px !important;
  .el-notification__title {
    margin-bottom: 14px;
    color: #333;
    .el-notification__content {
      color: #333;
    }
  }
}
.navbar {
  .el-dialog {
    min-width: auto !important;
  }
  .el-dialog__header {
    height: 61px;
    line-height: 60px;
    background: #fbfbfa;
    padding: 0 30px;
    font-size: 16px;
    color: #333;
    border: 0 none;
  }
  .el-dialog__body {
    padding: 10px 30px 30px;
    .el-radio,
    .el-radio__input {
      white-space: normal;
    }
    .el-radio__label {
      padding-left: 5px;
      color: #333;
      font-weight: 700;
      span {
        display: block;
        line-height: 20px;
        padding-top: 12px;
        color: #666;
        font-weight: normal;
      }
    }
    .el-radio__input.is-checked .el-radio__inner {
      &::after {
        background: #333;
      }
    }
    .el-radio-group {
      & > .is-checked {
        border: 1px solid #ffc200;
      }
    }
    .el-radio {
      width: 100%;
      background: #fbfbfa;
      border: 1px solid #e5e4e4;
      border-radius: 4px;
      padding: 14px 22px;
      margin-top: 20px;
    }
    .el-radio__input.is-checked + .el-radio__label {
      span {
      }
    }
  }
  .el-badge__content.is-fixed {
    top: 24px;
    right: 2px;
    width: 18px;
    height: 18px;
    font-size: 10px;
    line-height: 16px;
    font-size: 10px;
    border-radius: 50%;
    padding: 0;
  }
  .badgeW {
    .el-badge__content.is-fixed {
      width: 30px;
      border-radius: 20px;
    }
  }
}
.el-icon-arrow-down {
  background: url('./../../../assets/icons/up.png') no-repeat 50% 50%;
  background-size: contain;
  width: 8px;
  height: 8px;
  transform: rotate(0eg);
  margin-left: 16px;
  position: absolute;
  right: 16px;
  top: 12px;
  &:before {
    content: '';
  }
}

.userInfo {
  background: #fff;
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 99;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  width: 100%;
  border-radius: 4px;
  line-height: 32px;
  padding: 0 0 5px;
  height: 105px;
  .userList {
    width: 95%;

    padding-left: 5px;
  }
  p {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    padding: 0 5px 0 7px;
    i {
      margin-left: 10px;

      vertical-align: middle;
      margin-top: 4px;
      float: right;
    }
    &:hover {
      background: #f6f1e1;
    }
  }
}
.msgTip {
  color: #419eff;
  padding: 0 5px;
}

</style>
