<template>
  <div class="dataTotal">

    <!-- 搜索筛选 -->
    <el-form :inline="true">
      <el-form-item label="用户名称：">
        <el-input size="small" placeholder="请输入用户名称" v-model.trim="designation" clearable @clear='search'>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addUser()">添加</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <div>
      <el-table size="small" :data="listData" height="650" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="105" :index="indexMethod" align="center" />
        <el-table-column align="center" sortable prop="name" label="用户名称">
        </el-table-column>
        <el-table-column align="center" sortable prop="user" label="用户账号">
        </el-table-column>
        <el-table-column align="center" sortable prop="job" label="部门">
        </el-table-column>
        <el-table-column align="center" sortable prop="sex" :formatter="showstate" label="性别">
        </el-table-column>
        <el-table-column align="center" prop="disable" plain label="账号状态">
          <template slot-scope="scope">
            <el-switch @change="chageStatus(scope.row,$event,scope.$index)" :formatter="showstate"
              :disabled="scope.row.user == 'zhansan'" v-model="scope.row.disable" :active-value="1" :inactive-value="0"
              active-color="#ff4949" inactive-color="#13ce66">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="updataUser(scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" :disabled="scope.row.user == 'zhansan'"
              @click="deleteUser(scope.row)" plain></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增用户界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="dialogFormVisible = true">
      <el-form label="top" :inline="true" :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名称：" prop="user" required>
          <el-input size="small" v-model="addForm.designation" autocomplete="off" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="设置账号：" prop="designation" required>
          <el-input size="small" v-model="addForm.user" autocomplete="off" placeholder="请设置账号"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" prop="pass" required>
          <el-input size="small" v-model="addForm.pass" autocomplete="off" placeholder="请设置密码"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="job" required>
          <el-input size="small" v-model="addForm.job" autocomplete="off" placeholder="请设置部门"></el-input>
        </el-form-item>
        <el-form-item size="small" label="性别：" required prop="sex">
          <el-select v-model="addForm.sex" clearable placeholder="请选择性别" @click="onSearch1()">
            <el-option v-for="item in sex" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('addForm')">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="onSubmit('addForm')">保存
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
export default {
  name: "dataTotal",
  data () {
    return {
      designation: '',
      listData: [], //用户数据
      editFormVisible: false, //控制编辑页面显示与隐藏
      loading: false, //是显示加载
      title: '添加新用户',//弹窗名称
      sex: [{
        value: 0,
        label: '女'
      }, {
        value: 1,
        label: '男'
      }],
      rules: {
        user: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请设置密码', trigger: 'blur' },
          { min: 5, max: 15, message: '密码的长度在5~15个字符之间', trigger: 'blur' },

        ],
        job: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        designation: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ]
      },
      addForm: {
        user: '',
        pass: '',
        designation: '',
        job: '',
        sex: ''
      },

    };
  },
  methods: {
 
    updataUser (row) {
      var param = { id: row.user_id }
      console.log(row.user_id);
      this.$router.push({ name: 'updateData', query: { params: param } });

    },
    indexMethod (index) {
      return index + 1
    },
    //根据id修改用户状态
    chageStatus (data) {
      let updatauser = {
        is_disable: data.disable
      }
      var id = data.user_id
      this.$axios.put("/user/updatauserid?id=" + id, updatauser).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'warning',
            message: res.message
          });

        } else {
          this.$message({
            type: 'success',
            message: res.message
          });
        }
      })
    },
    showstate (row) {
      if (row.sex == 0) {
        return "女";
      }
      else {
        return "男";
      }
    },
    //查询所有用户
    list () {
      this.$axios.get("/user/alluser").then(res => {
        this.listData = res.data;
      }).catch(err => { })
    },

    //根据用户名称查询
    search () {
      if (this.designation == '') {
        this.list();
      } else {
        var username = this.designation;
        this.$axios.get("/user/value?username=" + username).then(res => {
          if (res.code == 205) {
            this.listData = [];
          } else {
            this.listData = res.data;
            console.log(res.data)

          }

        }).catch(err => {


        })
      }

    },
    addUser () {
      this.editFormVisible = true

    },
    onSubmit () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let formData = {
            user: this.addForm.user,
            pass: this.addForm.pass,
            designation: this.addForm.designation,
            job: this.addForm.job,
            sex: this.addForm.sex,
            is_disable: 1
          }
          this.$axios.post("/user/addusers", formData).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.message
              });

            } else {
              this.$message({
                type: 'warning',
                message: res.message
              });
            }

            this.list();
            this.editFormVisible = false;
            this.loading = false;
          }).catch(err => {


            this.editFormVisible = false;
            this.loading = false;
          });
        } else {
          return false;
        }
      });

    },
    // 关闭增加弹出框
    closeDialog (addForm) {
      this.editFormVisible = false;
      this.$refs[addForm].resetFields();
      this.$refs['addForm'].clearValidate(['']);
      this.list();

    },
    deleteUser (row) {
      console.log(row)
      this.$confirm('确定要删除该用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var id = row.user_id
          this.$axios.delete("/user/deleteuser?id=" + id).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.list();
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              })

            }
          })


        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '删除用户操作已取消！'
          })
        })


    }

  },
  created () {
    this.search()
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
