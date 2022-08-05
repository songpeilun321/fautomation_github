<template>
  <div class="log">
    <!-- 搜索筛选 -->
    <el-form :inline="true">
      <el-form-item label="用户名称：">
        <el-input size="small" placeholder="请输入用户名称" v-model="operator_name" clearable @clear='query'> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="query()">搜索</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <div>
      <el-table size="small" :data="listData" border height="600">
        <el-table-column type="index" sortable label="序号" width="105" :index="indexMethod" align="center" />
        <el-table-column align="center" prop="create_time" :formatter="timestampToTime" label="时间">
        </el-table-column>
        <el-table-column align="center" prop="operation_content" label="操作内容">
        </el-table-column>
        <el-table-column align="center" prop="operator_name" plain label="用户名称">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <center>
      <el-pagination class="el-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageNum" :page-sizes="[20, 30, 40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </center>
  </div>

</template>

<script>
export default {
  name: "log",
  data () {
    return {
      operator_name: "",
      listData: [],
      total: 0,
      pageSize: 20,
      pageNum: 1

    }
  },
  mounted () {
    this.list()
  },
  methods: {
    query (pageNum) {
      if (this.operator_name == '') {
        this.list();
      } else {
        let params = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          operator_name: this.operator_name


        }
        //第二页允许模糊查询配置
        if (null != pageNum) {
          this.pageNum = 1;
          params.pageNum = pageNum;
        }
        this.$axios.post("/logs/query", params).then(res => {
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
    //时间戳
    timestampToTime (row) {
      var a = this.$moment(row.create_time).utcOffset(0).format('YYYY-MM-DD  HH:mm:ss ')
      return a;
    },
    //表格第一个字段数字自增计算
    indexMethod: function (index) {
      return this.total - index - (this.pageNum - 1) * this.pageSize

    },
    //多少页
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.list();
    },
    //分页规定每页页码，从第一页开始查
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.list();
    },
    //查询所有用户
    list (pageNum) {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      //第二页允许模糊查询配置
      if (null != pageNum) {
        this.pageNum = 1;
        params.pageNum = pageNum;
      }
      this.$axios.post("/logs/allquery", params).then(res => {
        this.listData = res.data.data;
        this.total = res.data.total;
        console.log(res.total)
      }).catch(err => { })
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
