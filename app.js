const path = require("path");
const Koa = require("koa");
const Parser = require("koa-bodyparser");
const Static = require("koa-static");
const InitManager = require("./core/init");
const catchError = require("./middlewares/exception");
const router = require("./app/api/v1/user");
const cors = require("koa2-cors");

const app = new Koa();

app.use(catchError);
app.use(Parser());
app.use(Static(path.join(__dirname, "./static")));

//配置 cors 的中间件
app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      return "*";
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);

// 允许http请求的所有方法
app.use(router.allowedMethods());

InitManager.initCore(app);

app.listen(10086);
