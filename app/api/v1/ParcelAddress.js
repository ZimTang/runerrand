const Router = require("koa-router");
const { ParcelAddress } = require("../../model/parcelAddress");
const router = new Router({
  prefix: "/api/v1/parcel_address",
});

// 创建分类
router.post("/create", async (ctx) => {
  const { name } = ctx.request.body;
  const hasParcelAddress = await ParcelAddress.findOne({
    where: {
      name,
    },
  });
  if (hasParcelAddress) throw new global.errs.RepeatException();
  await ParcelAddress.create({ name });
  ctx.body = new global.errs.Success("创建成功");
});

// 分类列表
router.get("/list", async (ctx) => {
  const parcelAddressList = await ParcelAddress.findAll({});
  ctx.body = parcelAddressList;
});

// 删除分类
router.delete("/delete", async (ctx) => {
  const { name } = ctx.request.body;
  const parcelAddress = await ParcelAddress.findOne({
    where: {
      name,
    },
  });
  if (!parcelAddress) throw new global.errs.NotFound();
  parcelAddress.destroy();
  ctx.body = new global.errs.Success("删除成功");
});

module.exports = router;
