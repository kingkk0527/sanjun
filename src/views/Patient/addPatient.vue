<template>
  <div :key="vueRest"
       class="addBrand-container"
  >
    <div :key="restKey"
         class="container"
    >
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               :inline="true"
               label-width="180px"
               class="demo-ruleForm"
      >
        <div>
          <el-form-item label="患者名称:"
                        prop="name"
          >
            <el-input v-model="ruleForm.name"
                      placeholder="请填写患者名称"
                      maxlength="20"
            />
          </el-form-item>
          <el-form-item label="患者编号:"
                        prop="patientId"
          >
            <el-input v-model="ruleForm.patientId"
                      placeholder="请填写患者编号"
                      maxlength="20"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="年龄:"
                        prop="age"
          >
            <el-input v-model="ruleForm.age"
                      placeholder="请设置患者年龄"
            />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="ruleForm.sex" label="1">
              男
            </el-radio>
            <el-radio v-model="ruleForm.sex" label="2">
              女
            </el-radio>
          </el-form-item>
        </div>

        <div class="address">
          <el-form-item label="病历信息:"
                        prop="description"
          >
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="15"
              maxlength="2000"
              placeholder="病历描述，最长2000字"
              style="width: 1000px"
            />
          </el-form-item>
        </div>

        <div class="subBox address">
          <el-button @click="() => $router.back()">
            取消
          </el-button>
          <el-button type="primary"
                     :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm', 'goBack')"
          >
            保存
          </el-button>
          <el-button v-if="actionType == 'add'"
                     type="primary"
                     @click="submitForm('ruleForm', 'goAnd')"
          >
            保存并继续添加
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import HeadLable from '@/components/HeadLable/index.vue';
import ImageUpload from '@/components/ImgUpload/index.vue';
import { queryPatientById, addPatient, editPatient } from '@/api/Patient';
import { baseUrl } from '@/config.json';
import { getToken } from '@/utils/cookies';
import { types } from 'sass';
import List = types.List

@Component({ // 组件注册
  name: 'addPatient',
  components: {
    HeadLable,
    ImageUpload
  }
})
export default class extends Vue {
  private restKey: number = 0
  private actionType: string = ''
  private vueRest = '1'
  private headers = {
    token: getToken()
  }
  private ruleForm: { // 表单数据
    imageFile:null;
    image: string; // 患者图片
    patientId: string;
    sex: string;
    imageList: List<string>; // 患者图片列表
    name: string;
    description: string;
    id: number;
    age: number
  } = {
    imageFile: null,
    name: '',
    patientId: '',
    sex: '1',
    id: null,
    age: null,
    image: '',
    description: '',
    imageList: ''
  }

  get rules() {
    return {
      name: [
        {
          required: true,
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入患者名称'));
            } else {
              const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){1,20}$/;
              if (!reg.test(value)) {
                callback(new Error('患者名称输入不符，请输入1-20个字符'));
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

  created() {
    this.actionType = this.$route.query.id ? 'edit' : 'add';
    if (this.$route.query.id) {
      this.init();
    }
  }

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
        this.ruleForm.image = res.data.data.image;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  }

  private submitForm(formName: any, st: any) { // 提交表单
    (this.$refs[formName] as any).validate((valid: any) => {
      console.log(valid, 'valid');
      if (valid) {
        let params: any = { ...this.ruleForm };

        if (this.actionType === 'add') {
          delete params.id;
          addPatient(params)
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('添加成功！');
                if (st === 'goBack') {
                  this.$router.push({ path: '/patient' });
                } else {
                  this.ruleForm.image = '';
                  this.ruleForm = {
                    imageFile: null,
                    image: '',
                    name: '',
                    patientId: '',
                    sex: '1',
                    id: null,
                    age: null,
                    imageList: '',
                    description: ''
                  };
                  this.restKey++;
                }
              } else {
                this.$message.error(res.data.desc || res.data.msg);
              }
            })
            .catch(err => {
              this.$message.error('请求出错了：' + err.message);
            });
        } else {
          editPatient(params)
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
        }
      } else {
        return false;
      }
    });
  }

  imageChange(value: any) {
    this.ruleForm.image = value;
    this.ruleForm.imageList[0] = value;
  }

  handleLocalImage(file) {
    this.ruleForm.imageFile = file.raw; // 存储文件对象
    // 生成本地预览URL
    const url = URL.createObjectURL(file.raw);
    this.ruleForm.image = url;
    this.ruleForm.imageList[0] = url;
    this.$message.success(url);
  }
}
</script>

<style lang="scss" scoped>
.addBrand-container {
  margin: 30px;

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

  .preview-image { // 添加预览图片样式
    max-width: 3500px;
    max-height: 350px;
    object-fit: contain; // 添加等比例缩放
    margin-top: 10px;
    border-radius: 4px;
  }

  .upload-tip {
    color: #606266;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 10px;
  }
}

</style>
