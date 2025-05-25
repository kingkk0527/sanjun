import { getEmployeeList } from '../../api/employee';
<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px">
          用户姓名:
        </label>
        <el-input v-model="name" placeholder="请输入员工姓名" style="width: 15%" />
        <el-button type="primary" style="margin-left: 25px" @click="pageQuery()">
          查询
        </el-button>
        <el-button type="primary" style="float: right" @click="handleAddEmp">
          +添加用户
        </el-button>
      </div>
      <el-table
        :data="records"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="用户姓名" width="180" />
        <el-table-column prop="userName" label="账号" width="180" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="password" label="密码" />
        <el-table-column prop="role" label="用户权限">
          <template slot-scope="scope">
            {{ scope.row.role === 'admin' ? '管理员' : '用户' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdateEmp(scope.row)">
              修改
            </el-button>
            <el-button
              type="text" style="color: #ff0000"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { getEmployeeList, deleteEmployee } from '@/api/employee';
import router from '@/router';

export default {
  // 模型数据
  data() {
    return {
      name: '', // 员工姓名，对应上面的输入框
      page: 1, // 页码
      pageSize: 10, // 每页记录数
      total: 0, // 总记录数
      records: [] // 当前页要展示的数据集合
    };
  },
  created() { // 页面加载直接默认查询
    this.pageQuery();
  },
  methods: {
    // 分页查询
    pageQuery() {
      // 准备请求参数
      const params = { name: this.name, page: this.page, pageSize: this.pageSize };

      // 发送Ajax请求，访问后端服务，获取分页数据
      getEmployeeList(params).then(res => {
        if (res.data.code === 1) {
          this.total = res.data.data.total;
          this.records = res.data.data.records;
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err.message);
      });
    },
    // pageSize发生变化时触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.pageQuery();
    },
    // page发生变化时触发
    handleCurrentChange(page) {
      this.page = page;
      this.pageQuery();
    },
    // 删除方法
    handleDelete(row) {
      if (row.userName === 'admin') {
        this.$message.error('admin为系统的超级管理员账号，不能删除！');
        return;
      }
      this.$confirm('确认要删除该账户吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEmployee(row.id).then(res => {
          if (res.data.code === 1) {
            this.$message.success('账户删除成功');
            this.pageQuery();
          }
        });
      });
    },
    // 跳转到新增员工页面（组件）
    handleAddEmp() {
      // 路由跳转，跳转到新增员工组件
      this.$router.push('/employee/add');
    },
    // 跳转到修改员工页面（组件）
    handleUpdateEmp(row) {
      if (row.userName === 'admin') {
        this.$message.error('admin为系统的超级管理员账号，不能修改！');
        return;
      }

      // 跳转到修改页面，通过地址栏传递参数
      this.$router.push({
        path: '/employee/add',
        query: { id: row.id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}
</style>
