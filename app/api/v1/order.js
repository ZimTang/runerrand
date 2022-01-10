// 订单
const Router = require("koa-router");
const { Order } = require("../../model/order");
const { User } = require("../../model/user");
const { Category } = require("../../model/category");
const { User_Order } = require("../../model/user_order");
const router = new Router({
  prefix: "/api/v1/order",
});

// 创建订单
router.post("/create", async (ctx) => {
  const { openid, orderInfo } = ctx.request.body;
  const { category } = orderInfo;
  // 获取用户id
  const user_id = await User.getUserByOpenid(openid);
  // 获取分类id
  const category_id = await Category.getCateIdByName(category);
  const order = await Order.createOrder(user_id, orderInfo, category_id);
  const order_id = order.getDataValue("id");
  console.log(order_id, user_id);
  await User_Order.create({
    order_id: order_id,
    user_id: user_id,
  });
  ctx.body = new global.errs.Success("创建订单成功");
});

// 查询我的订单
router.post("/myorder", async (ctx) => {
  const { openid } = ctx.request.body;
  const user_id = await User.getUserByOpenid(openid);
  const orderList = await Order.getOrderByOpenid(user_id);
  ctx.body = {
    orderList,
  };
});

// 查询未完成的订单
router.get("/get_unfinished", async (ctx) => {
  const unfinishedOrderList = await Order.getUnfinishedOrder();
  return unfinishedOrderList;
});

// 接单

// 查询我帮助的

// 正在悬赏的


module.exports = router;
