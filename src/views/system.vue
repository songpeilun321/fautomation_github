<template>
  <div class="system">

    <!--列表-->
    <div>
      <el-button size="small" style="margin-left: 90% ; margin-top: 28px" type="primary" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
      <br/>
      <br/>
      <el-table size="small" :data="listData" border height="600">
        <el-table-column type="index" sortable label="序号" width="105" :index="indexMethod" align="center" />
        <el-table-column align="center" prop="jobname"  label="jenkins名称">
        </el-table-column>
        <el-table-column align="center" prop="proname" label="项目名称">
        </el-table-column>
        <el-table-column align="center" prop="time" :formatter="timestampToTime" plain label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteProject(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增与编辑用户界面 -->
    <el-dialog :title="title"  width="30%" :visible.sync="dialogFormVisible" @close="closeDialog()" >
      <el-form label="top" :inline="true" :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="项目名称：" prop="name" required>
          <el-input size="small" v-model="addForm.name" autocomplete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="jenkins名称：" prop="jobname" required>
          <el-input size="small" v-model="addForm.jobname" autocomplete="off" placeholder="请设置jenkins名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="onSubmit(addForm)">保存
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
export default {
  name: "system",
  data () {
    return {
      listData: [],
      dialogFormVisible: false, //控制编辑页面显示与隐藏
      loading: false, //是显示加载
      title: '添加新项目',//弹窗名称
       rules: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        jobname: [
          { required: true, message: 'jenkins名称不能为空', trigger: 'blur' }
        ]
      },
        addForm: {
        name: '',
        jobname: ''
      },


    }
  },
  mounted () {
    this.list()
  },
  methods: {
  //关闭弹窗
  closeDialog(){
      this.addForm = {
        name:　'',
        jobname: ''
      }
      this.$refs['addForm'].clearValidate('');
      this.$refs['addForm'].resetFields();
      this.dialogFormVisible = false
    //  this.$refs['addForm'].resetFields();
    //   this.$refs['addForm'].clearValidate(['']);
      // this.editFormVisible = false;
      // this.$nextTick(()=>{
      //   this.$refs['addForm'].resetFields();
      // });   
      
  },
  onSubmit(addForm){
       this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if(this.title=="添加新项目"){
           let formData = {
            name: this.addForm.name,
            jobname: this.addForm.jobname
          }
          this.$axios.post("/project/addproject", formData).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.message
              });
             
           
            }else {
              this.$message({
                type: 'warning',
                message: res.message
              });
            }
            this.dialogFormVisible = false;
            this.list();
            this.loading = false;
          }).catch(err => {

          });
           }else{
         //获取表单数据
          let formData = {
            cid : localStorage.getItem("cid"),
            name: this.addForm.name,
            jobname: this.addForm.jobname
                     }
          this.$axios.post("/project/alterproject", formData).then(res => {
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
            this.dialogFormVisible = false;
            this.loading = false;
          
          }).catch(err => {

          });
        }
          }else {

            return false;
        
        }
         })
    },
    handleAdd(){
		  this.title='添加新项目'
		  this.dialogFormVisible=true;
     
	  },
    //表格的操作定义
    handleEdit(row) {
        this.title='编辑项目信息';
        this.dialogFormVisible = true;
        var cid =row.cid
        localStorage.setItem("cid",cid)
        this.addForm.name = row.proname;
        console.log(row.proname)
        this.addForm.jobname = row.jobname;
        
      },
    //根据cid删除项目
    deleteProject(row){
        this.$confirm('确定要删除该项目吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var cid = row.cid;
         this.$axios.delete("/project/delproject?cid=" + cid ).then(res => {       
               if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.list()
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
            message: '删除项目操作已取消！'
          })
        })
     

    },
    //查询所有项目信息
    list () {
        this.$axios.get("/project/project").then(res => {
             this.listData= res.data
        })
    },
    //时间戳
    timestampToTime (row) {
      var a = this.$moment(row.create_time).utcOffset(0).format('YYYY-MM-DD  HH:mm:ss ')
      return a;
    },
    //表格第一个字段数字自增计算
      indexMethod (index) {
      return index + 1
    },
 

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
