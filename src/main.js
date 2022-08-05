import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/plugins/antd.js";
import "@/components/index";
import "@/plugins/axios";
import moment from "moment";
import ElementUI from "element-ui"; // 导入组件相关样式
import "element-ui/lib/theme-chalk/index.css"; // 配置vue插件
// 引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;

Vue.prototype.$moment = moment;

console.log("NODE_ENV", process.env.NODE_ENV);

import VueResource from "vue-resource";
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.config.productionTip = false;
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
