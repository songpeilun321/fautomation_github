module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          // modifyVars: {
          // 	"primary-color": "#1DA57A",
          // 	"link-color": "#1DA57A",
          // 	"border-radius-base": "2px"
          // },
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "轻舟用例管理后台";
      return args;
    });
  },
  lintOnSave: false,
  devServer: {
    // 前端启动服务地址
     host: '10.4.1.61',
     port: 8888,
    proxy: {
      "/": {
        // 接口地址
        target: "http://10.4.1.61:9876/",
        logLevel: "debug",

      }
    }
  }
};
