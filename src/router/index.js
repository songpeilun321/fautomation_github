import Vue from "vue";
import VueRouter from "vue-router";
import moment from 'moment' //导入文件

Vue.prototype.$moment = moment; //赋值使用
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      path: "/login"
    }
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录页"
    },
    component: () => import("@/views/login")
  },
  {
    path: "/index",
    name: "index",
    meta: {
      title: ""
    },
    component: () => import("@/views/index")
  },
  {
    path: "/dataTotal",
    name: "dataTotal",
    meta: {
      title: "用户管理"

    },
    component: () => import("@/views/data")
  },
  {
    path: "/log",
    name: "log",
    meta: {
      title: "日志管理"

    },
    component: () => import("@/views/log")
  },
  {
    path: "/system",
    name: "system",
    meta: {
      title: ""

    },
    component: () => import("@/views/system")
  },
  {
    path: "/dataTotal/updateData",
    name: "updateData",
    meta: {
      title: "",
      highLight: "/dataTotal"
    },
    component: () => import("@/views/updateData")
  },
  {
    path: "/news",
    name: "news",
    meta: {
      title: ""
    },
    component: () => import("@/views/news")
  },
  {
    path: "/news/edit",
    name: "news-edit",
    meta: {
      title: "",
      highLight: "/news"
    },
    component: () => import("@/views/news-edit")
  },
  {
    path: "/news/add",
    name: "news-add",
    meta: {
      title: "",
      highLight: "/news"
    },
    component: () => import("@/views/news-add")
  }

];

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  mode: "hash",
  routes
});


//导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    localStorage.clear();
    sessionStorage.clear();
    return next();
  }

  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()

})


router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;