<template>
  <div class="news">

    <el-menu :default-active="current" class="el-menu-demo" mode="horizontal" background-color="#2B3948"
      text-color="#fff" @select="menuSelect" active-text-color="#409EFF">
      <el-menu-item v-for="(item, index) in typelist" :key="item.cid" :index="index+''">
        {{item.proname}}
      </el-menu-item>
    </el-menu>
    <br>
    <br>
    <!-- 搜索筛选 -->
    <el-form :inline="true">
     <el-form-item label="类型:" >
        <el-select size="small" v-model="form.type"  placeholder="请选择是否执行" >
          <el-option v-for="item in selectList"  :label="item.title" :value="item.type">
          </el-option>  
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input size="small" placeholder="请输入查询数据" v-model.trim="form.title" clearable @clear='query' > </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="query()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addCase()">添加</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <div>
      <el-table size="small" :data="listData" height="600" border>
        <el-table-column type="index" sortable label="序号" width="105" :index="indexMethod" align="center" />
        <!-- <el-table-column align="center" sortable prop="id" label="用例编号" width="100">
        </el-table-column> -->
        <el-table-column align="center" prop="name" label="用例所属模块" width="100">
        </el-table-column>
        <el-table-column align="center" prop="title" label="用例名称" width="150">
        </el-table-column>
        <el-table-column align="center" prop="url" plain label="接口地址" width="150">
        </el-table-column>
        <el-table-column align="center" prop="method" plain label="请求方式" width="80">
        </el-table-column>
        <el-table-column align="center" prop="header" plain label="请求头" width="100">
        </el-table-column>
        <el-table-column align="center" prop="leve" plain label="是否执行" width="100">
        </el-table-column>
        <el-table-column align="center" prop="param" plain label="请求参数" width="200">
        </el-table-column>
        <el-table-column align="center" prop="judge" plain label="逻辑判断" width="80">
        </el-table-column>
        <el-table-column align="center" prop="assert" plain label="状态码" width="80">
        </el-table-column>
        <el-table-column align="center" prop="remark" plain label="备注" width="100">
        </el-table-column>
        <el-table-column align="center" sortable prop="time" plain label="创建时间" width="100 "
          :formatter="timestampToTime">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="updataCase(scope.row)"></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" :disabled="scope.row.leve == 'P0'"
              @click="deleteCase(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <br>
    <!-- 分页组件 -->
    <center>
      <el-pagination class="el-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageNum" :page-sizes="[10, 20, 30,40]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </center>

  </div>
</template>

<script>
export default {
  name: "news",
  data () {
    return {
      // form表单收集参数
      form: {
        type: 'url',
        title: '',
      },
      selectList: [],
      current: '',
      listData: [], //用例数据
      typelist: [], // 项目列表
      total: 0,
      pageSize: 10,
      pageNum: 1
    }
  },
  mounted () {
     this.$nextTick(() => {
          this.getProject()
          this.SearchTypeList()
          })
  
    
    
 
  
  },
  methods: {
    //获取用例查询类型数据
    SearchTypeList(){
        this.$axios.get("/case/SearchTypeList").then(res => { 
        this.selectList = res.data
        })
    },
    //多少页
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.query();
    },
    //分页规定每页页码，从第一页开始查
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.query();
    },
    // 菜单激活
    menuSelect (index) {
      console.log(index)
      this.current = index + ''
      sessionStorage.setItem('tabIndex', this.current)
      this.query()
    },
    // 获取所有项目
    getProject () {
      this.$axios.get("/project/project").then(res => {
        if (res.code == 200) {
          this.typelist = res.data;
          this.$nextTick(() => {
            if (sessionStorage.getItem('tabIndex')) {
              this.current = sessionStorage.getItem('tabIndex');
            } else {
              this.current = '0'
            }
            this.query()
          })
        } else {
          this.typelist = [];
        }
      })
    },

    //时间戳
    timestampToTime (row) {
      var a = this.$moment(row.time).utcOffset(0).format('YYYY-MM-DD  HH:mm:ss ')
      return a;
    },
    //表格第一个字段数字自增计算
    indexMethod: function (index) {
      return this.total - index - (this.pageNum - 1) * this.pageSize

    },
    //根据项目id新增用例
    addCase () {
      let cid = this.typelist[this.current].cid
      this.$router.push({
        name: 'news-add',
        query: {
          cid: cid
        }
      });
    },
    //根据项目id和用例id修改用例
    updataCase (row) {
      var param = {
        id: row.id,
        cid: this.typelist[this.current].cid
      }
      console.log(param);

      this.$router.push({
        name: 'news-edit',
        query: {
          param: param
        }
      });

    },
    //根据项目id和用例名称查询用例
    query (pageNum) {
      
      if (this.form.title  == '') {
         this.list();
      } else {
        let params = {
          cid: this.typelist[this.current].cid,
          key:this.form.type,
          value: this.form.title,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
        //第二页允许模糊查询配置
        if (null != pageNum) {
          this.pageNum = 1;
          params.pageNum = pageNum;
        }
        this.$axios.post("/case/search", params).then(res => {
          this.handleList(res)
        })
      }
    },
    // 用例列表返回统一处理
    handleList (res) {
      const {
        code,
        data,
        message
      } = res
      if (code == 200) {
        this.listData = data.data;
        this.total = data.total;
      } else {
        this.$message({
          type: 'warning',
          message: message
        })
        this.listData = [];
      }
    },
    //根据项目id查询所有用例
    list () {
      var params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        cid: this.typelist[this.current].cid
      }

      this.$axios.post("/case/allCase", params).then(res => {
        this.handleList(res)
      })
    },
    //根据用例id删除用例
    deleteCase: function (row) {
      this.$confirm('确定要删除该用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var param = {
            id: row.id
          }
          this.$axios.delete("/case/deletecase", {
            params: param
          }).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.query()
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




  }
}
</script>

<style lang="scss">
.news {
  input[disabled],
  input:disabled,
  input.disabled {
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
    opacity: 1;
  }

  .ant-list-item-meta {
    align-items: initial;

    .ant-list-item-meta-content {
      display: flex;
      flex-direction: column;

      .ant-list-item-meta-description {
        flex: 1;

        .description {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &_content {
            width: 600px;
            margin-top: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;

    // background-color: red;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .title {
    display: flex;

    ul {
      display: flex;
      align-items: center;

      li {
        list-style: none;
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
