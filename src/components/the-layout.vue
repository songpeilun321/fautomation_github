<template>
  <a-layout id="theLayout">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo">轻舟用例管理后台</div>
      <a-menu theme="dark" mode="inline" v-model="selectedKey" @click="menuClick">
        <a-menu-item key="/index">
          <a-icon type="home" />
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="/news">
          <a-icon type="bars" />
          <span>用例管理</span>
        </a-menu-item>
        <a-menu-item key="/dataTotal">
          <a-icon type="user" />
          <span>用户管理</span>
        </a-menu-item>
        <a-menu-item key="/log">
          <a-icon type="check" />
          <span>日志管理</span>
        </a-menu-item>
         <a-sub-menu key="sub1">
        <span slot="title">
        <a-icon type="setting" />
        <span>系统配置</span>
        </span>
        <a-menu-item key="/system">
           项目信息配置
        </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)" />
        <div class="dropdown">
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{ username }}
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="http://www.qzdata.cc/home" target="_blank">轻舟能科</a>
              </a-menu-item>
              <a-menu-item @click="logout">
                <a href="javascript:;">退出</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content :style="{
					margin: '24px 16px',
					padding: '24px',
					background: '#fff',
					minHeight: '280px'
				}">
        <h1 style="margin-bottom: 16px; font-weight: bold">
          {{ $route.meta.title }}
        </h1>
        <slot></slot>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  name: "theLayout",
  data () {
    return {
      username: "",
      collapsed: false,
      selectedKey: ["dataTotal"]
    };
  },
  watch: {
    $route () {
      this.setSelectedKey();
    }
  },
  mounted () {
    let name = JSON.parse(localStorage.getItem("name"));
    console.log(name)
    this.username = name
    console.log(this.username)
    this.setSelectedKey();
  },
  methods: {
    // menu高亮设置
    setSelectedKey () {
      let key = this.$route.meta.highLight || this.$route.path;
      if (this.selectedKey[0] === key) return;
      this.selectedKey = [key];
    },
    // menu点击
    menuClick ({ key }) {
      this.$router.push({ path: `${key}` });
    },
    logout () {
      this.$axios.get("/user/logout").then(res => {
        if (res.code == 200) {
          this.$message.success("成功退出！！！");
          // 清空token
          window.sessionStorage.clear()
          //清空本地缓存
          window.localStorage.clear();
          // 跳转到登录界面
          this.$router.push({ name: "login" });

          // history.pushState(null, null, document.URL);
          // window.addEventListener("popstate", function (e) {

          //   history.pushState(null, null, document.URL);

          // }, false);
        } else {
          this.$message.success("退出失败！");
        }

      });
    }
  }
};
</script>
<style lang="scss">
#theLayout {
  .ant-layout {
    min-height: 100vh;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dropdown {
        padding: 0 24px;
      }
    }
  }
  .logo {
    height: 32px;
    margin: 16px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .trigger {
    &:hover {
      color: #1890ff;
    }
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
}
</style>
