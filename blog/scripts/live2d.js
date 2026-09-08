"use strict";

const root = hexo.config.root || "/";
const asset = (file) => root + file.replace(/^\//, "");

hexo.extend.injector.register(
  "body_end",
  `<script src="${asset("live2dw/lib/L2Dwidget.min.js")}?094cbace49a39548bed64abff5988b05"></script>
<script>
L2Dwidget.init({
  pluginRootPath: "live2dw/",
  pluginJsPath: "lib/",
  pluginModelPath: "assets/",
  tagMode: false,
  debug: false,
  model: {
    jsonPath: "${asset("live2dw/assets/z16.model.json")}"
  },
  display: {
    position: "right",
    width: 280,
    height: 400
  },
  mobile: {
    show: true
  },
  log: false
});
</script>`
);
