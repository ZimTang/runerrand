// 订单
const Router = require("koa-router");
const { Order } = require("../../model/order");
const { User } = require("../../model/user");
const { Category } = require("../../model/category");
const { User_Order } = require("../../model/user_order");
const pagnation = require("../../../util/pagnation");
const router = new Router({
  prefix: "/api/v1/order",
});

// 创建订单
router.post("/create", async (ctx) => {
  const { openid } = ctx.req.headers;
  const { category } = ctx.request.body;
  const orderInfo = Object.assign({}, ctx.request.body);
  orderInfo.state = 0;
  delete orderInfo.openid;
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
  const { openid } = ctx.req.headers;
  const { page, pageSize } = ctx.request.body;
  const user_id = await User.getUserByOpenid(openid);
  const orderList = await Order.getOrderByOpenid(user_id, page, pageSize);
  ctx.body = orderList;
});

// 查询未接单的
router.post("/unaccepted", async (ctx) => {
  const { page, pageSize } = ctx.request.body;
  const unacceptedOrderList = await Order.getOrderListByState(
    0,
    page,
    pageSize
  );
  ctx.body = unacceptedOrderList;
});

// 查询接单但未完成的订单列表
router.post("/unfinished", async (ctx) => {
  const { page, pageSize } = ctx.request.body;
  const unfinishedOrderList = await Order.getOrderListByState(
    1,
    page,
    pageSize
  );
  ctx.body = unfinishedOrderList;
});

// 查询已完成的订单列表
router.post("/finished", async (ctx) => {
  const { page, pageSize } = ctx.request.body;
  const finishedOrderList = await Order.getOrderListByState(2, page, pageSize);
  ctx.body = finishedOrderList;
});

// 接单
router.post("/accept", async (ctx) => {
  const { openid } = ctx.req.headers;
  // id为订单的id
  const { id } = ctx.request.body;
  const helper_id = await User.getUserByOpenid(openid);
  const user_id = await User_Order.getUserIdByOrderId(id);
  // 如果发起用户和帮助者相同
  if (helper_id == user_id) throw new global.errs.AcceptError("发起用户和帮助者相同");
  const order = await Order.getOrderByid(id);
  // 接单
  await User_Order.accpetOrder(order, helper_id);
  ctx.body = new global.errs.Success("接单成功");
});

// 查询我帮助的
router.post("/myhelp", async (ctx) => {
  const { openid } = ctx.req.headers;
  const { page, pageSize } = ctx.request.body;
  const user_id = await User.getUserByOpenid(openid);
  const orderIdList = await User_Order.getHelpOrderListByUserId(
    user_id,
    page,
    pageSize
  );
  const helpOrderList = [];

  for (let i = 0; i < orderIdList.length; i++) {
    helpOrderList.push(await Order.getOrderByid(orderIdList[i]));
  }

  // todo：接单人和发起人信息没有查出来
  ctx.body = pagnation(page, pageSize, helpOrderList);
});

module.exports = router;
