<template>
  <div :key="vueRest"
       class="addBrand-container"
  >
    <div :key="restKey"
         class="container"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules"
               :inline="true" label-width="180px" class="demo-ruleForm" >

        <div>
          <el-form-item label="患者名称:" prop="name" >
            <el-input v-model="ruleForm.name" placeholder="请填写患者名称" maxlength="20" />
          </el-form-item>
          <el-form-item label="患者编号:" prop="patientId" >
            <el-input v-model="ruleForm.patientId" placeholder="请填写患者编号" maxlength="20" />
          </el-form-item>
        </div>
        <div>

          <el-form-item label="年龄:" prop="age" >
            <el-input v-model="ruleForm.age" placeholder="请设置患者年龄" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="ruleForm.sex" label="1"> 男 </el-radio>
            <el-radio v-model="ruleForm.sex" label="2"> 女 </el-radio>
          </el-form-item>
        </div>

        <div class="address">
          <el-form-item label="病情描述:" prop="description" >
            <el-input v-model="ruleForm.description" type="textarea" :rows="5"
                      maxlength="500" placeholder="病情描述，最长2000字" style="width: 1000px" />
          </el-form-item>
        </div>

        <div class="images">
          <!--患者图片url列表为string数组-->
          <el-form-item label="患者图片:" prop="imageList">
            <div class="image-container">
              <el-carousel
                v-if="ruleForm.imageList.length > 0"
                indicator-position="outside"
                class="carousel-box"
                :autoplay="false"
              >
                <!--                  :key="item.id"-->
                <el-carousel-item
                  v-for="(item, index) in ruleForm.imageList"
                  :key="index"
                >
                  <div class="image-item">
<!--                    <img :src="item" class="carousel-image" />-->
                    <el-image
                      :src="item"
                      :preview-src-list="[item]"
                      class="carousel-image"
                      fit="contain"
                    />
                    <!-- 图片删除 -->
                    <el-button
                      class="delete-btn"
                      type="danger"
                      circle
                      icon="el-icon-delete"
                      @click="handleDelete(index)"
                    />
                  </div>
                </el-carousel-item>
              </el-carousel>

              <!-- 图片上传 -->
              <el-upload
                :multiple="true"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="handleUpload"
                :disabled="uploading"
                class="uploader"
              >
                <div style="display: flex; align-items: center; gap: 10px;">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :loading="uploading"
                  >
                    添加图片
                  </el-button>
                  <p style="margin:0; color: #909399; font-size: 12px;">
                    建议上传 PNG/JPEG/JPG 类型 图片大小不超过10M
                  </p>
                </div>
                </el-upload>
            </div>
          </el-form-item>
        </div>

        <div class="subBox address">
          <el-button @click="() => $router.back()"> 取消 </el-button>
          <el-button type="primary" :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm')" > 保存 </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import HeadLable from '@/components/HeadLable/index.vue';
import ImageUpload from '@/components/ImgUpload/index.vue';
import { queryPatientById, addPatient, editPatient, deletePatientImage } from '@/api/Patient';
import { getToken } from '@/utils/cookies';
import axios from 'axios';

@Component({ // 组件注册
  name: 'detailPatient',
  components: {
    HeadLable,
    ImageUpload
  }
})
export default class extends Vue {
  private restKey: number = 0
  private uploading = false; // 上传状态
  private actionType: string = ''
  private vueRest = '1'
  private headers = {
    token: getToken()
  }
  private ruleForm: {
    image: string; // 患者图片url地址  单张图片地址用于 分页查询 展示
    patientId: string; // 患者编号
    sex: string; // 患者性别
    imageList: string[]; // 患者图片数组类型
    name: string; // 患者姓名
    description: string; // 患者病情描述
    id: number; // 患者数据库主键id
    age: number; // 患者年龄
  } = {
    name: '',
    patientId: '',
    sex: '1',
    id: null,
    age: null,
    image: '',
    description: '',
    imageList: []
  }
  // 表单验证规则
  get rules() {
    return {
      name: [
        {
          required: true,
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入患者名称'));
            } else {
              const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,20}$/;
              if (!reg.test(value)) {
                callback(new Error('患者名称输入不符，请输入2-20个字符'));
              } else {
                callback();
              }
            }
          },
          trigger: 'blur'
        }
      ],
      image: {
        required: true,
        message: '患者图片不能为空'
      },
      age: [
        {
          required: true,
          validator: (rules: any, value: string, callback: Function) => {
            if (value <= 0) {
              callback(
                new Error(
                  '年龄不得小于0'
                )
              );
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      // 患者编号 必填
      patientId: [
        {
          required: true,
          message: '请输入患者编号',
          trigger: 'blur'
        }
      ],
      // 病情描述 必填
      description: [
        {
          required: true,
          message: '病情描述不能为空',
          max: 2000,
          trigger: 'blur'
        }
      ]
    };
  }
  // 生命周期钩子函数  用于 初始化方法  用于 查看编辑患者信息时  从后台获取患者信息
  created() {
    this.actionType = this.$route.query.id ? 'edit' : 'add';
    if (this.$route.query.id) {
      this.init();
    }
  }

  // 图片上传前校验
  beforeUpload(file) {
    const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isImage) {
      this.$message.error('只能上传图片格式!');
      return false;
    }
    if (!isLt10M) {
      this.$message.error('图片大小不能超过10MB!');
      return false;
    }
    return true;
  }

  // 上传，api接口：/patient/upload
  handleUpload(options) {
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', options.file);
    formData.append('id', this.ruleForm.id);

    axios.post('/api/patient/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // 'Authorization': `Bearer ${this.getToken()}`
        'Authorization': `Bearer ${getToken()}`
      }
    }).then(response => {
      if (response.data.code === 1) {
        this.handleUploadSuccess(response.data);
      } else {
        this.handleUploadError(response.data.msg);
      }
    }).catch(error => {
      this.handleUploadError(error.message);
    }).finally(() => {
      this.uploading = false;
    });
  }

  // 处理上传成功
  handleUploadSuccess(response) {
    if (response.data && response.data.url) {
      this.ruleForm.imageList.push(response.data.url);
      // 自动设置首张为封面
      if (!this.ruleForm.image) {
        this.ruleForm.image = response.data.url;
      }
      this.$message.success('图片上传成功');
    } else {
      this.$message.error('无效的响应格式');
    }
  }

  // 处理上传错误
  handleUploadError(msg) {
    this.$message.error(msg || '图片上传失败，请重试');
  }

  // 删除图片
  handleDelete(index) {
    // 图片url
    const targetUrl = this.ruleForm.imageList[index];
    // 确认对话框
    this.$confirm('确定要永久删除该图片吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => { // 调用删除接口
      const deleteJson = {
        id: this.ruleForm.id, // 患者主键id
        imageUrl: targetUrl
      };

      deletePatientImage(deleteJson).then(res => {
        if (res.data.code === 1) {
          // 前端移除
          this.ruleForm.imageList.splice(index, 1);
          // 如果删除的是当前单图
          if (this.ruleForm.image === targetUrl) {
            this.ruleForm.image = this.ruleForm.imageList[0] || '';
          }
          this.$message.success('删除成功');
        }
      }).catch(() => { // 用户点击取消不报错
        this.$message.error('删除失败');
      });
    }).catch(() => {});
  }

  // 初始化方法  用于 查看编辑患者信息时  从后台获取患者信息
  private async init() {
    queryPatientById(this.$route.query.id).then(res => {
      if (res && res.data && res.data.code === 1) {
        this.ruleForm = { ...res.data.data };
        this.ruleForm.sex = String(res.data.data.sex);
        this.ruleForm.age = res.data.data.age;
        this.ruleForm.description = res.data.data.description;
        this.ruleForm.patientId = res.data.data.patientId;
        this.ruleForm.name = res.data.data.name;
        this.ruleForm.patientId = res.data.data.patientId;
        this.ruleForm.image = res.data.data.image; // 患者单张图片
        this.ruleForm.imageList = res.data.data.imageList || []; // 患者图片列表
      } else {
        this.$message.error(res.data.msg);
      }
    });
  }

  // 保存 提交表单方法
  private submitForm(formName: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      console.log(valid, 'valid');
      if (valid) {
        let params: any = { ...this.ruleForm };
        editPatient(params) // TODO 调用编辑患者信息的接口 接口在 api/Patient.ts 中
          .then(res => {
            if (res && res.data && res.data.code === 1) {
              this.$router.push({ path: '/patient' });
              this.$message.success('修改成功！');
            } else {
              this.$message.error(res.data.desc || res.data.msg);
            }
          })
          .catch(err => {
            this.$message.error('请求出错了：' + err.message);
          });
      } else {
        return false;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;  // 新增水平居中
  gap: 20px; // 兼容性增强
  row-gap: 20px; // 兼容旧版浏览器
}

.carousel-box { // 轮播图容器大小
  width: 500px;
  height: 350px;
  margin: 0 auto;
    @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
}

/* 不需要修改的部分 */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain; // 保持图片比例正确
}

.image-item {
  position: relative;
  height: 100%;
}

.delete-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;

  // 保持Element UI loading状态样式
  &.is-loading {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.uploader {
  margin-top: 0px; // 保持合理间距
}

.addBrand-container {
  margin: 10px;

  .container {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 30px;
    border-radius: 4px;
    min-height: 500px;

    .subBox {
      padding-top: 30px;
      text-align: center;
      border-top: solid 1px $gray-5;
    }
  }

  .el-form--inline .el-form-item__content {
    width: 250px;
  }

  .el-input {
    width: 350px;
  }

  .address {
    .el-form-item__content {
      width: 100% !important;
    }

    .el-textarea {
      width: 100%;

      .el-textarea__inner {
        resize: vertical;
        height: 150px;
        overflow-y: auto;
      }
    }
  }
  ::v-deep .el-form-item {
    margin-bottom: 18px;  // 减小表单项之间的垂直间距

    .el-form-item__content,
    .el-form-item__label {
      line-height: 32px;  // 降低行高
    }

    .el-input__inner {
      height: 32px;       // 减小输入框高度
      padding: 5px 10px;  // 调整内边距
    }

    .el-textarea__inner {
      min-height: 80px !important;  // 降低文本域高度
    }
  }

  .tableLab {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .button-group {
      display: flex;
      align-items: center;
      gap: 10px; // 按钮之间留出空隙
    }
  }
}
</style>
