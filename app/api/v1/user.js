const Router = require("koa-router");
const { User } = require("../../model/user");
const axios = require("axios");
const { wx } = require("../../../config/config");
const upload = require("../../../util/upload");
const config = require("../../../config/config");

const router = new Router({
  prefix: "/api/v1/user",
});

// 用户授权，及插入用户数据
router.post("/token", async (ctx) => {
  // 获取code与用户信息
  let {
    code,
    nickName,
    gender,
    city,
    province,
    country,
    avatarUrl,
  } = ctx.request.body;
  const userInfo = {
    nick_name: nickName,
    gender,
    city,
    province,
    country,
    avartar_url: avatarUrl,
  };
  console.log(userInfo);
  let session_key, openid;
  // 向微信发起请求 获取openid
  let res = await axios.get(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${wx.appId}&secret=${wx.appSecret}&js_code=${code}&grant_type=authorization_code`
  );
  openid = res.data.openid;
  session_key = res.data.session_key;
  await User.createUser(openid, userInfo);
  // 返回openid
  ctx.body = {
    openid,
  };
});

// 上传头像
router.post("/upload", upload.single("file"), async (ctx) => {
  const avatar = (config.host + ctx.req.file.path).replace(/\\/g, "/");
  ctx.body = avatar;
});

// 更新用户信息
router.post("/update", async (ctx) => {
  const { openid } = ctx.req.headers;
  let { nickName, gender, city, province, country, avatarUrl } =
    ctx.request.body;
  const userInfo = {
    nick_name: nickName,
    gender,
    city,
    province,
    country,
    avartar_url: avatarUrl,
  };
  await User.getUserByOpenid(openid);
  await User.updateUser(openid, userInfo);
  ctx.body = new global.errs.Success("更新用户信息成功");
});

module.exports = router;
