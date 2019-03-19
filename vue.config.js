module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL
    : '/',
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
