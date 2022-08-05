<template>
  <div class="main">
    <div class="login-box">
      <img :src="logo" />
      <div class="title-box">
        <div style="font-size: 20px"></div>
      </div>

      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input size="large" type="text" placeholder="帐户" v-decorator="[
							'username',
							{
								rules: [
									{ required: true, message: '请输入帐户' }
								],
								validateTrigger: 'blur'
							}
						]">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>

        <a-form-item style="margin-bottom: 32px">
          <a-input-password size="large" placeholder="密码" v-decorator="[
							'password',
							{
								rules: [
									{
										required: true,
										message: '请输入密码, 最少5位',
										min: 5
									}
								],
								validateTrigger: 'blur'
							}
						]">
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>

        <a-form-item style="margin-top: 24px">
          <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="loginLoading">登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data () {
    return {
      form: this.$form.createForm(this),
      username: "",
      password: "",
      token: "",
      loginLoading: false,
      logo: require("../assets/logo.png")
    };
  },
  methods: {

    handleSubmit (e) {
      e.preventDefault();
      const {
        form: { validateFields }
      } = this;
      validateFields(["username", "password"], (err, values) => {

        if (!err) {
          this.$axios.post("/user/login", values).then(res => {
            if (res.code == 400) {
              this.$message({
                type: 'warning',
                message: res.message
              })
            } else if (res.code == 200) {
              console.log('------------------登录信息', res)
              localStorage.setItem(
                "token",
                res.data.token
              );  // 缓存token
              localStorage.setItem(
                "name",
                JSON.stringify(res.data.userinfo.name)
              );
              window.sessionStorage.setItem("token", res.data.token)
              console.log(res.data.userinfo.name)
              this.$message.success("登录成功");
              this.$router.push({ name: "index" });

            }

          });
        } else {
          // this.$message.error("账户或密码不能为空");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100%;
  background: #f0f2f5 url(~@/assets/background.png) no-repeat 50%;
  background-size: 100%;
  display: flex;
  justify-content: center;
  .login-box {
    width: 398px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    margin-top: 300px;
    margin-left: 920px;

    img {
      width: 420px;
      height: 600px
    }
    .title-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
      .num {
        width: 38px;
        height: 32px;
        opacity: 1;
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: rgba(0, 0, 0, 0.45);
        line-height: 32px;
      }
    }
    #formLogin {
      width: 368px;
      .login-button {
        width: 368px;
        height: 40px;
        opacity: 1;
        background: #13c2c2;
        border-radius: 2px;
        border-color: #13c2c2;
      }
    }
  }
}
</style>
