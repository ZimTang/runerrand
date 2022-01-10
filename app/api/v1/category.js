const Router = require("koa-router");
const { Category } = require("../../model/category");
const router = new Router({
  prefix: "/api/v1/category",
});

// 创建分类
router.post("/create", async (ctx) => {
  const { name } = ctx.request.body;
  const hasCate = await Category.findOne({
    where: {
      name,
    },
  });
  if (hasCate) throw new global.errs.RepeatException();
  await Category.create({ name });
  ctx.body = new global.errs.Success("创建成功");
});

// 分类列表
router.get("/list", async (ctx) => {
  const cateList = await Category.findAll({});
  ctx.body = cateList;
});

// 删除分类
router.delete("/delete", async (ctx) => {
  const { name } = ctx.request.body;
  const category = await Category.findOne({
    where: {
      name,
    },
  });
  if (!category) throw new global.errs.NotFound();
  category.destroy();
  ctx.body = new global.errs.Success("删除成功");
});

module.exports = router;
