import axios from "axios";
import Vue from "vue";
import router from "../router/index";
// 默认全局配置
axios.defaults.baseURL = "/api";
axios.defaults.timeout = 10 * 1000;
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (localStorage.getItem("token")) {
      config.headers.token =
        localStorage.getItem("token");
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    errorInfo();
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // let { code, data, msg } = response.data;
    console.log('响应拦截', response)
    // 对响应数据做点什么
    if (response.status === 200) {
      // if (response.headers["authorization"])
      // 	localStorage.setItem(
      // 		"_authorization",
      // 		response.headers["authorization"]
      // 	);
      return response.data;

    } else if (response.status === 403) {
      errorInfo("登录失效", 403);
    } else {
      errorInfo(response.message);
    }
    return Promise.reject(response);
  },
  function (error) {
    errorInfo("响应错误");
    return Promise.reject(error);
  }
);

function errorInfo (text = "请求失败", status) {
  Vue.prototype.$message.error(text);
  if (status === 40300) {
    router.push("/login");
  }
}
Vue.prototype.$axios = axios;
