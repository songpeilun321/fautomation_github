<template>
  <div class="index">
    <el-menu :default-active="current" class="el-menu-demo" mode="horizontal" background-color="#2B3948"
      text-color="#fff" @select="menuSelect" active-text-color="#409EFF">
      <el-menu-item v-for="(item, index) in typelist" :key="item.cid" :index="index">
        {{item.proname}}
      </el-menu-item>
    </el-menu>

    <br>
    <br>
    <div class="block">
      <span class="demonstration">选择日期：</span>
      <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" size="small">
      </el-date-picker>
      <a-button type="primary" style="margin-left: 16px" @click="query()"> 查询</a-button>
      <a-button type="primary" style="margin-left: 16px" @click="reset()"> 重置</a-button>
      <a-button type="primary" style="margin-left: 700px" @click="execution()"> 执行用例</a-button>
      <a-button type="primary" target="_blank" style="margin-left:16px" @click="selectDetails()"> 查看执行结果</a-button>
      <!-- <a-button type="primary" style="margin-left:16px" @click="initData()"> xxx</a-button>W -->
    </div>
    <br>
    <br>

    <el-row :gutter="12" style="font-weight:bolder;">
			<el-col :span="6" style="">
				<el-card shadow="hover">
					今日新增用例数:
					<span>{{span1}}</span>
				</el-card>
			</el-col>
      <el-col :span="6" style="">
				<el-card shadow="hover">
					今日执行用例数:
					<span>{{span2}}</span>
				</el-card>
			</el-col>
		</el-row>


    <el-col :span="12">
      <div id="chartPie" ref="chartPie" style="width:70%; height:400px;"></div>
    </el-col>

    <div class="chart" ref="chartDom"></div>

  </div>

</template>

<script>
import * as echarts from "echarts";
export default {
  name: "index",
  data () {
    return {
      span1: '暂无数据',
      span2: '暂无数据',
      // 项目列表
      typelist: [],
      // 当前选中的项目名称
      current: '',
      // 搜索条件
      time: [],
      // 图表
      chart: null,
      chartPie: null,
      pieList: [],
      option: {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["总数", "通过数量", "异常数量", "跳过数量", "不通过数量"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [

        ]
      },

    }
  },
  created () {
    this.initTime();
  },
  mounted () {
    this.getProject()


  },
  methods: {
    // 今日运行用例数
    runningCases () {
   
      let params = {
        cid: localStorage.getItem("cid"),
        // todaystart: startTime2,
        // todayend: endTime2

      }
      this.$axios.post("/case/number", params).then(res => {
        this.span1 = res.data.casesum;
        this.span2 = res.data.operationsum

      })
    },
    // 今日新增用例数:
    // useCases() {
    // 	var startTime2 = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') // 当天0点的时间格式
    // 	var endTime2 = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss') // 当天23点59分59秒的时间格式
    // 	// let cid = this.typelist[this.current].cid
    // 	let params = {
    // 		cid: localStorage.getItem("cid"),
    // 		todaystart: startTime2,
    // 		todayend: endTime2

    // 	}
    // 	this.$axios.post("/case/newlynumber", params).then(res => {
    // 		this.span1 = res.data.number;
    // 	})

    // },
    drawPieChart () {
      // var cid = localStorage.getItem("cid")
      let cid = this.typelist[this.current].cid
      this.$axios.get("/jenkins/resultcid?cid=" + cid).then(res => {
        let broken = {
          name: "异常数量",
          type: "line",
          data: []
        };
        let failed = {
          name: "不通过数量",
          type: "line",
          data: []
        };
        let passed = {
          name: "通过数量",
          type: "line",
          data: []
        };
        let skipped = {
          name: "跳过数量",
          type: "line",
          data: []
        };
        // let sum = { name: "总数", type: "line", data: [] };
        for (let item of res.data) {
          broken.data.push(item.broken);
          failed.data.push(item.failed);
          passed.data.push(item.passed);
          skipped.data.push(item.skipped);
        }
        this.series = [broken, failed, passed, skipped];
        this.chartPie = echarts.init(document.getElementById('chartPie'));
        if (res.data != "") {
          this.chartPie.setOption({
            title: {
              text: '最近一条用例数据',
              // subtext: '最新的一条数据',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ["通过数量", "异常数量","不通过数量", "跳过数量"]
            },
            series: [{
              name: '用例数据',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [{
                value: res.data[0].skipped,
                name: '跳过数量'
              },
              {
                value: res.data[0].passed,
                name: '通过数量'
              },
              {
                value: res.data[0].broken,
                name: '异常数量'
              },
              {
                value: res.data[0].failed,
                name: '不通过数量'
              },


                // { value: res.data[0].sum, name: '总数' }

              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          });
          // this.runningCases();

        } else {
          this.chartPie.setOption({
            title: {
              text: '暂无用例数据',
              // subtext: '最新的一条数据',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ["跳过数量", "不通过数量", "异常数量", "通过数量"]
            },
            series: [{
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [{
                value: null,
                name: '跳过数量'
              },
              {
                value: null,
                name: '通过数量'
              },
              {
                value: null,
                name: '异常数量'
              },
              {
                value: null,
                name: '不通过数量'
              },
                // { value: null, name: '总数' }
                // [broken, failed, passed, skipped, sum]
                // broken, failed, passed, skipped, sum
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          });
        }

      });
    },
    //传入jobnanme获取最新job地址信息
    selectDetails () {
      let jobnanme = this.typelist[this.current].jobname
      this.$axios.get("/jenkins/record?jobnanme=" + jobnanme).then(res => {
        console.log(res.data);
        if (res.data == '') {
          this.$message({
            type: 'warning',
            message: res.message
          })

        } else {
          var url = res.data
          window.open(url, '_blank');
        }

      })
    },
    // 获取所有项目
    getProject () {
      this.$axios.get("/project/project").then(res => {
        if (res.code == 200) {
          this.typelist = res.data;
          this.$nextTick(() => {
            this.current = 0
            this.query()



          })

        } else {
          this.typelist = [];
        }
      })
    },
    // 查询当前项目下的日志信息
    query () {
      if (this.time.length !== 2) {
        this.$message.info("时间选择不完整");
        return;
      }
      let cid = this.typelist[this.current].cid
      localStorage.setItem("cid", cid);
      this.$axios
        .post("/jenkins/result", {
          end: this.$moment(this.time[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          start: this.$moment(this.time[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          cid
        }).then(res => {

          // let duration = { name: "总持续时间", type: "line", data: [] };
          let sum = {
            name: "总数",
            type: "line",
            data: []
          };
          let passed = {
            name: "通过数量",
            type: "line",
            data: []
          };
          let broken = {
            name: "异常数量",
            type: "line",
            data: []
          };
          let failed = {
              name: "不通过数量",
              type: "line",
              data: []
            };
          let skipped = {
            name: "跳过数量",
            type: "line",
            data: []
          };

          let xAxis = []
          for (let item of res.data) {
            sum.data.push(item.sum);
            passed.data.push(item.passed);
            broken.data.push(item.broken);
            skipped.data.push(item.skipped);
            failed.data.push(item.failed);
            // duration.data.push(item.duration);
            // id.data.push(item.id);



            xAxis.push(this.$moment(item.time).utcOffset(0).format('YYYY年MM月DD日  HH:mm:ss '));

          }
          this.option.xAxis.data = xAxis
          this.option.series = [sum, passed, broken, skipped, failed];

          this.initChart()
          this.drawPieChart()
          this.runningCases()



          // this.cases()


        })


    },

    // 重置
    reset () {
      this.initTime();
      this.query()


    },
    // 初始化图表
    initChart () {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartDom);
      }
      this.chart.setOption(this.option);
      this.chart.resize();
      window.onresize = () => {
        this.chart.resize();
      };
    },
    // 菜单激活
    menuSelect (index) {
      this.current = index
      this.query();
      this.initTime();


    },
    // 立即执行
    execution () {
      let jobname = this.typelist[this.current].jobname
      this.$axios.get("/jenkins/executejob?jobnanme=" + jobname).then(res => {
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
    },
    initTime () {
      this.time = [
        this.$moment().subtract(15, "days"),
        this.$moment().subtract(0, "days")
      ];
    }

  }


}
</script>

<style lang="scss">
.index {
  .chart {
    width: 70%;
    height: 450px;
    margin-top: 48px;
    margin-left: 500px;
  }
}

.chart-container {
  width: 70%;
  float: right;
}

.el-col {
  padding: 30px 20px;
}
</style>
