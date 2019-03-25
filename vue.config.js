module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL : '/',
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/style/variables.scss";
        `
      }
    }
  }
};
