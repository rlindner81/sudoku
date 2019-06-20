module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? process.env.BASE_URL : "/",
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
  // https://cli.vuejs.org/config/#css-loaderoptions
  // css: {
  //   loaderOptions: {
  //     // https://github.com/webpack-contrib/sass-loader
  //     sass: {
  //       data: ""
  //     }
  //   }
  // }
};
