<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 10px">患者姓名：</label>
        <el-input v-model="inputName"
                  placeholder="请填写患者姓名"
                  style="width: 14%"
                  clearable
                  @clear="init"
                  @keyup.enter.native="initFun"
        />
        <label style="margin-right: 30px">患者编号：</label>
        <el-input v-model="patientId"
                  placeholder="请填写患者编号"
                  style="width: 14%"
                  clearable
                  @clear="init"
                  @keyup.enter.native="initFun"
        />
        <el-button class="normal-btn continue" @click="init(true)">
          查询
        </el-button>

        <div class="tableLab">
          <span class="delBut non"
                @click="deleteHandle('批量', null)"
          >批量删除</span>

          <el-button type="primary"
                     style="margin-left: 15px"
                     @click="addPatient('add')"
          >
            + 新增患者
          </el-button>
        </div>
      </div>
      <el-table v-if="tableData.length"
                :data="tableData"
                stripe
                class="tableBox"
                @selection-change="handleSelectionChange"
      >
        <!--       //多选框-->
        <el-table-column type="selection"
                         width="25"
        />
        <el-table-column prop="name"
                         label="患者姓名"
        />
        <el-table-column prop="patientId" label="患者编号">
          <template slot-scope="scope">
            <div>{{ scope.row.patientId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="{ row }">
            {{ row.sex === '1' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <span style="margin-right: 10px">{{ scope.row.age }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updateTime"
                         label="最后操作时间"
        />
        <el-table-column label="操作"
                         width="250"
                         align="center"
        >
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       class="blueBug"
                       @click="addPatient(scope.row.id)"
            >
              详情
            </el-button>
            <el-button type="text"
                       size="small"
                       class="delBut"
                       @click="deleteHandle('单删', scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Empty v-else
             :is-search="isSearch"
      />
      <el-pagination v-if="counts > 10"
                     class="pageList"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="counts"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeadLable from '@/components/HeadLable/index.vue';
import { getPatientPage, deletePatient } from '@/api/Patient';
import Empty from '@/components/Empty/index.vue';
import { baseUrl } from '@/config.json';

@Component({
  name: 'patientType',
  components: {
    HeadLable,
    Empty
  }
})
export default class extends Vue {
  private inputName: any = ''
  private patientId: any = ''
  private counts: number = 0
  private page: number = 1
  private pageSize: number = 10
  private checkList: string[] = []
  private tableData: [] = []
  private isSearch: boolean = false

  created() {
    this.init();
  }

  initFun() {
    this.page = 1;
    this.init();
  }
  // 查询
  private async init(isSearch?) { // 初始进入分页查询 患者名称 患者编号
    this.isSearch = isSearch;
    await getPatientPage({
      page: this.page, // 分页查询 当前页数
      pageSize: this.pageSize, // 分页查询 每页条数
      name: this.inputName || undefined, // 分页查询 患者名称
      patientId: this.patientId || undefined // 分页查询 患者编号
    })
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data && res.data.data && res.data.data.records;
          this.counts = Number(res.data.data.total);
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message);
      });
  }

  // 添加 详情
  private addPatient(st: string) {
    if (st === 'add') {
      this.$router.push({ path: '/patient/add' });
    } else {
      this.$router.push({ path: '/patient/detail', query: { id: st } });
    }
  }

  // 删除
  private deleteHandle(type: string, id: any) {
    if (type === '批量' && id === null) {
      if (this.checkList.length === 0) {
        return this.$message.error('请选择删除对象');
      }
    }
    this.$confirm('确认删除该患者, 是否继续?', '确定删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deletePatient(type === '批量' ? this.checkList.join(',') : id)
        .then(res => {
          if (res && res.data && res.data.code === 1) {
            this.$message.success('删除成功！');
            this.init();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$message.error('请求出错了：' + err.message);
        });
    });
  }

  // 全部操作
  private handleSelectionChange(val: any) { // 多选框 选中的id
    let checkArr: any[] = [];
    val.forEach((n: any) => {
      checkArr.push(n.id);
    });
    this.checkList = checkArr;
  }

  private handleSizeChange(val: any) { // 分页查询 每页条数
    this.pageSize = val;
    this.init();
  }

  private handleCurrentChange(val: any) { // 分页查询 当前页数
    this.page = val;
    this.init();
  }
}
</script>
<style lang="scss">
.el-table-column--selection .cell {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .container {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 30px 28px;
      border-radius: 4px;
      //查询黑色按钮样式
      .normal-btn {
        background: #333333;
        color: white;
        margin-left: 20px;
      }

      .tableBar {
        margin-bottom: 20px;

        .tableLab {
          display: inline-block;
          float: right;

          span {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            padding: 0 20px;
            color: $gray-2;
          }
        }
      }

      .tableBox {
        width: 100%;
        border: 1px solid $gray-5;
        border-bottom: 0;
      }

      .pageList {
        text-align: center;
        margin-top: 30px;
      }
    }
  }
}
</style>
