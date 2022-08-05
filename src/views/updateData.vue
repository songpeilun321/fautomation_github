<template>
  <div class="updateData">
    <!-- 面包屑导航 -->
    <el-breadcrumb style="margin-top: 0px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dataTotal' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑用户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 编辑表单 -->
    <el-form ref="form" style="margin-top: 100px; " :rules="rules" :inline="false" :model="formData" label-width="150px"
      size="small" clearable>
      <el-form-item label="用户名称：" required prop="name">
        <el-input v-model="formData.name" placeholder="请输入用户名称" clearable></el-input>
      </el-form-item>
      <br>
      <el-form-item label="用户账号：" required prop="user">
        <el-input v-model="formData.user" placeholder="请输入用户账号" clearable :disabled="formData.user == 'zhansan'"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="性别：" required prop="sex">
        <el-select v-model="formData.sex" placeholder="请选择性别">
          <el-option v-for="item in sex" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="职位：" required prop="job">
        <el-input v-model="formData.job" placeholder="请输入职位" clearable></el-input>
      </el-form-item>
      <br>
      <el-form-item label="是否禁用：" required prop="disable">
        <el-select v-model="formData.disable" placeholder="请选择是否禁用" :disabled="formData.user == 'zhansan'">
          <el-option v-for="item in disable" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <br> <br>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')">立即提交</el-button>
        <el-button @click="resetForm('formData')">取消</el-button>
      </el-form-item>

    </el-form>

  </div>

</template>
        <script>
export default {
  name: "updateData",
  data () {
    return {
      list: {},
      id: this.$route.query.params.id,
      formData: [],
      disable: [{
        value: 0,
        label: '启用'
      }, {
        value: 1,
        label: '禁用'
      }],
      sex: [{
        value: 0,
        label: '女'
      }, {
        value: 1,
        label: '男'
      }]



    }

  },

  methods: {

    resetForm () {
      this.$router.push({ name: 'dataTotal' });

    },
    submitForm () {
      let updatauser = {
        user: this.formData.user,
        designation: this.formData.name,
        sex: this.formData.sex,
        job: this.formData.job,
        is_disable: this.formData.disable

      }
      this.$axios.put("/user/updatauser?id=" + this.id, updatauser).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.$router.push({ name: 'dataTotal' });

      })


    },
    listId () {
      this.$axios.get("/user/information?id=" + this.id).then(res => {
        this.list = res.data;
        console.log(res.data)
        this.formData.name = this.list.name,
          this.formData.user = this.list.user,
          this.formData.sex = this.list.sex,
          this.formData.job = this.list.job,
          this.formData.disable = this.list.disable
        this.formData = res.data

      })

    }



  }
  ,
  created () {
    this.listId();
  }
};
        </script>

        <style lang="scss">
.dataTotal {
  .chart {
    width: 100%;
    height: 400px;
    margin-top: 48px;
  }
}
</style>
