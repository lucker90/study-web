const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  //这个参数可以把静态资源路径变成相对路径
  publicPath: "/study/",
  //构建好的文件放在哪个目录
  outputDir: "dist/study",
  //放静态资源（js、css、image、fonts）
  assetsDir: "./static",
  runtimeCompiler: false, // 运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  lintOnSave: false, // 关闭ESLint编译
  pages: {
    ball: {
      entry: "./src/pages/canvas/ball/index.js",
      template: "./public/index.html",
      filename: "ball.html",
      title:"小球碰撞"
    }
  },

  chainWebpack: (config) => {
    //热替换
    // 修复HMR
    // config.resolve.symlinks(true);
    config.resolve.alias
      .set("root", resolve("/"))
      .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"))
      .set("@utils", resolve("src/utils"))
      .set("components", resolve("src/components"))
      .set("@assets", resolve("src/assets"));
  },
  // 打包相关
  configureWebpack: (config) => {
    config.resolve.extensions = [".js", ".vue", ".json"];
  },
  css: {
    // CSS 相关的 loader 传递选项
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [],
      },
    },
  },
};
