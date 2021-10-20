// const fs = require("fs");
// const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devServer: {
      // public: "desktop.lan",
      // host: "desktop.lan",
      // https: true,
      // key: fs.readFileSync(path.join(__dirname, "certs/desktop.lan.key")),
      // cert: fs.readFileSync(path.join(__dirname, "certs/decktop.lan.crt")),
    }
  }
};
