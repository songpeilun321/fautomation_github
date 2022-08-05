<template>
  <div class="newsEdit">
    <!-- 面包屑导航 -->
    <el-breadcrumb style="margin-top: 0px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/news' }">用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑用例</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <br>
    <el-form ref="formData" :inline="false" :model="formData" label-width="150px" size="small" clearable>
      <el-form-item label="用例模块：" required prop="name">
        <el-input v-model="formData.name" placeholder="请输入用例模块" clearable></el-input>
      </el-form-item>
      <el-form-item label="用例名称：" required prop="title">
        <el-input v-model="formData.title" placeholder="请输入用例标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="接口地址：" required prop="url">
        <el-input v-model="formData.url" placeholder="请输入接口地址：url" clearable></el-input>
      </el-form-item>
      <el-form-item label="请求方式：" required prop="method">
        <el-select v-model="formData.method" placeholder="请选择请求方式">
          <el-option v-for="item in method" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求头：" required prop="header">
        <el-input type="textarea" v-model="formData.header" placeholder="请输入请求头"></el-input>
      </el-form-item>
      <el-form-item label="请求参数：" prop="param">
        <el-input type="textarea" v-model="formData.param" placeholder="请输入请求参数"></el-input>
      </el-form-item>
      <el-form-item label="是否执行：" required prop="leve">
        <el-select v-model="formData.leve" placeholder="请选择是否执行">
          <el-option v-for="item in leve" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口逻辑判断："  prop="judge">
        <el-input v-model="formData.judge" clearable placeholder="请输入接口逻辑"></el-input>
      </el-form-item>
      <el-form-item label="状态码断言判断:" required prop="assert">
        <el-input v-model="formData.assert" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" v-model="formData.remark" clearable></el-input>
      </el-form-item>
      <br />
      <br />
      <br />
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')">立即提交</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "news-edit",
  data () {
    return {
      formData: {
        moudle: '',
        title: '',
        url: '',
        methods: '',
        headers: '',
        leve: '',
        case_param: '',
        judge: '',
        asser: '',
        create_time: '',
        remark: ''

      },
      cid: '',
      list: {},
      formData: [],
      id: this.$route.query.param.id,

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
        assert: [{ required: true, message: "请输入状态码断言", trigger: "blur" }]
      },
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
      leve: [{
        value: 'P0',
        label: 'P0'
      }, {
        value: 'P4',
        label: 'P4'
      }],
      judges: [{
        value: 'None',
        label: 'NONE'
      },
      {
        value: 'date',
        label: 'DATE'
      },
      {
        value: 'seven_data',
        label: 'SEVEN_DATA'
      },
      {
        value: 'start_ends',
        label: 'STAR_ENDS'
      },
      {
        value: 'start_end',
        label: 'STAR_END'
      },
      {
        value: 'curve',
        label: 'CURVE'
      }]



    };
  },
  methods: {
    listId () {
      this.$axios.get("/case/infocase?id=" + this.id).then(res => {
        this.list = res.data;
        console.log(res.data)
        this.formData.name = this.list.name,
          this.formData.title = this.list.title,
          this.formData.header = this.list.header,
          this.formData.url = this.list.url,
          this.formData.leve = this.list.leve,
          this.formData.judge = this.list.judge,
          this.formData.param = this.list.param,
          this.formData.method = this.list.method,
          this.formData.remark = this.list.remark,
          this.formData.assert = this.list.assert
        this.formData = res.data

      })

    },
    submitForm () {
      console.log(this.cid)
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          let updataCase = {
            moudle: this.formData.name,
            title: this.formData.title,
            url: this.formData.url,
            methods: this.formData.method,
            asser: this.formData.assert,
            headers: this.formData.header,
            leve: this.formData.leve,
            judge: this.formData.judge,
            case_param: this.formData.param,
            remark: this.formData.remark,
            cid: this.$route.query.param.cid,
          }
          this.$axios.put("/case/updatacase?id=" + this.id, updataCase).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
           this.$router.go(-1)

          })

        } else {
          return false;
        }


      })

    },
    resetForm () {
      //this.$router.push({ name: 'news' });
      this.$router.go(-1)
    }

  },
  created () {
    this.listId();
  }
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
