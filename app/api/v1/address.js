const Router = require("koa-router");
const { Address } = require("../../model/address");
const { User } = require("../../model/user");
const router = new Router({
  prefix: "/api/v1/address",
});

// 创建地址
router.post("/create", async (ctx) => {
  const { openid, building, info, name, phone, is_default } =
    ctx.request.body.data;
  const addressInfo = { building, info, name, phone, is_default };
  const user_id = await User.getUserByOpenid(openid);
  await Address.createAddress(addressInfo, user_id);
  ctx.body = new global.errs.Success("创建成功");
});

// 修改地址信息
router.post("/update", async (ctx) => {
  const { openid, addressInfo } = ctx.request.body;
  const user_id = await User.getUserByOpenid(openid);
  await Address.updateAddress(addressInfo, user_id);
  ctx.body = new global.errs.Success("修改成功");
});

// 查询地址列表
router.post("/list", async (ctx) => {
  const { openid, page, pageSize } = ctx.request.body.data;
  const user_id = await User.getUserByOpenid(openid);
  const addressList = await Address.getAddressListByUserid(
    user_id,
    page,
    pageSize
  );
  ctx.body = {
    addressList,
  };
});

// 删除地址
router.delete("/delete", async (ctx) => {
  const { id, openid } = ctx.request.body;
  console.log(ctx.request.body);
  const user_id = await User.getUserByOpenid(openid);
  await Address.deleteAddress(user_id, id);
  ctx.body = new global.errs.Success("删除成功");
});

module.exports = router;
