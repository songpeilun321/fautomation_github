<template>
  <div class="newsEdit">
    <!-- 面包屑导航 -->
    <el-breadcrumb style="margin-top: 0px" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/news' }">用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增用例</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <br />
    <el-form ref="formData" :inline="false" :model="formData" :rules="rules" label-width="150px" size="small" clearable>
      <el-form-item label="用例模块：" required prop="moudle">
        <el-input v-model="formData.moudle" clearable placeholder="请输入用例模块"></el-input>
      </el-form-item>
      <el-form-item label="用例名称：" required prop="title">
        <el-input v-model="formData.title" clearable placeholder="请输入用例标题"></el-input>
      </el-form-item>
      <el-form-item label="接口地址：" required prop="url">
        <el-input v-model="formData.url" clearable placeholder="请输入接口地址：url"></el-input>
      </el-form-item>
      <el-form-item label="请求方式：" required prop="methods">
        <el-select v-model="formData.methods" clearable placeholder="请选择请求方式" @change="onSearch()">
          <el-option v-for="item in method" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="请求头：" required prop="headers">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" maxlength="500" show-word-limit
          v-model="formData.headers" placeholder="请输入请求头"></el-input>
      </el-form-item>

      <el-form-item label="请求参数：" prop="case_param">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" maxlength="500" show-word-limit
          v-model="formData.case_param" placeholder="请输入请求参数"></el-input>
      </el-form-item>
      <el-form-item label="是否执行：" required prop="leve">
        <el-select v-model="formData.leve" clearable placeholder="请选择是否执行">
          <el-option v-for="item in leve" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口逻辑判断:" prop="judge">
        <el-input v-model="formData.judge" clearable placeholder="请输入接口逻辑"></el-input>
      </el-form-item>

      <el-form-item label="状态码断言判断:" required prop="status">
        <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="formData.status" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" maxlength="500" show-word-limit
          v-model="formData.remark"></el-input>
      </el-form-item>

      <br />
      <br />
      <br />
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
        <el-button @click="countermand ()">取消</el-button>
        <el-button @click="resetForm('formData')">重置</el-button>

      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "news-add",
  data () {
    return {
      formData: {
        moudle: '',
        title: '',
        url: '',
        methods: 'POST',
        headers: '{"Content-Type": "application/json"}',
        leve: 'P4',
        case_param: '',
        judge: '',
        asser: 200,
        create_time: '',
        remark: ''

      },
      cid: '',
      method: [{
        value: 'post',
        label: 'POST'
      }, {
        value: 'get',
        label: 'GET'
      }, {
        value: 'put',
        label: 'PUT'
      }, {
        value: 'detele',
        label: 'DETELE'
      }],
      value:'post',
      leve: [
     
      {
        value: 'P0',
        label: 'P0'
      }, {
        value: 'P4',
        label: 'P4'
      }],
      
      rules: {
        moudle: [
          { required: true, message: "用例模块不能为空", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "用例模块的长度在1~40个字符之间",
            trigger: "blur",
          }
        ],
        name: [
          { required: true, message: "用例名称不能为空", trigger: "blur" },
          {
            min: 3,
            max: 40,
            message: "用例名称的长度在3~40个字符之间",
            trigger: "blur",
          }
        ],
        title: [
          { required: true, message: "用例标题不能为空", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "用例标题的长度在3~30个字符之间",
            trigger: "blur",
          }
        ],
        url: [{ required: true, message: "接口地址不能为空", trigger: "blur" }],
        methods: [
          { required: true, message: "请求方式不能为空", trigger: "change" }
        ],
        // judge: [
        //   { required: true, message: "请输入接口逻辑", trigger: "blur" }
        // ],
        headers: [{
          required: true, message: "请求头不能为空", trigger: "blur"
        }],
        // case_param: [{ required: true, message: "请输入请求参数", trigger: "blur" }],
        leve: [{ required: true, message: "请选择是否执行", trigger: "change" }],
        status: [{ required: true, message: "请输入状态码断言", trigger: "blur" }]
      }
    };
  },
  methods: {
    countermand () {
      this.$router.go(-1);
    },
    // timestampToTime(row) {
    // 	  var date = new Date(row.time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    // 	  var Y = date.getFullYear() + '-'
    // 	  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    // 	  var D = date.getDate() + ' '
    // 	  var h = date.getHours() + ':'
    // 	  var m = date.getMinutes() + ':'
    // 	  var s = date.getSeconds()
    // 	  return Y + M + D + h + m + s
    // 	},
    onSearch () {
      console.log('value是' + this.formData.methods)

    },
    submitForm () {

      this.$refs['formData'].validate((valid) => {
        if (valid) {
          var addForm = {
            moudle: this.formData.moudle,
            title: this.formData.title,
            url: this.formData.url,
            methods: this.formData.methods,
            headers: this.formData.headers,
            leve: this.formData.leve,
            case_param: this.formData.case_param,
            judge: this.formData.judge,
            asser: this.formData.status,
            remark: this.formData.remark,
            create_time: this.formData.time,
            cid: this.$route.query.cid * 1
          };
          this.$axios.post("/case/addclases", addForm)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: res.message,
                });
               this.$router.go(-1)

              } else {
                this.$message({
                  type: "warning",
                  message: res.message,
                });
              }
            }).catch(err => {

            });

        } else {
          return false;
        }


      })




    },
    resetForm (formData) {
      this.$refs['formData'].clearValidate();
      this.$refs[formData].resetFields();

    },
  },
};
</script>

<style lang="scss">
.ant-calendar-picker-container {
  z-index: 999999;
}
.newsEdit {
  .red {
    color: #ff0000;
    font-size: 12px;
  }
  .bt16 {
    margin-bottom: 16px;
  }
  #wangeditor {
    resize: vertical;
  }
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .ant-upload {
    img {
      width: 100%;
    }
  }
}
</style>
