const Router = require("koa-router");
const { Address } = require("../../model/address");
const { User } = require("../../model/user");
const router = new Router({
  prefix: "/api/v1/address",
});

// 创建地址
router.post("/create", async (ctx) => {
  const { openid } = ctx.req.headers;
  const addressInfo = Object.assign({}, ctx.request.body);
  delete addressInfo.openid;
  const user_id = await User.getUserByOpenid(openid);
  const oldDefaultAddress = await Address.findOne({
    where: {
      is_default: true,
    },
  });
  // 找到原来的默认地址
  if (oldDefaultAddress?.getDataValue("is_default")) {
    const address = await Address.findOne(
      {
        where: {
          is_default: true,
        },
      },
      {
        where: {
          user_id,
        },
      }
    );
    // 将原本的默认地址设置为普通地址
    address.update(
      {
        is_default: false,
      },
      {
        where: {
          user_id,
        },
      }
    );
  }
  // 创建新地址
  await Address.createAddress(addressInfo, user_id);
  ctx.body = new global.errs.Success("创建成功");
});

// 修改地址信息
router.post("/update", async (ctx) => {
  const { openid } = ctx.req.headers;
  const addressInfo = Object.assign({}, ctx.request.body);
  delete addressInfo.openid;
  const user_id = await User.getUserByOpenid(openid);
  const oldDefaultAddress = await Address.findOne({
    where: {
      is_default: true,
    },
  });
  // 如果更新的地址为默认地址 并且以前还存在默认地址
  if (addressInfo.is_default && oldDefaultAddress?.getDataValue("is_default")) {
    const address = await Address.findOne(
      {
        where: {
          is_default: true,
        },
      },
      {
        where: {
          user_id,
        },
      }
    );
    // 将原本的默认地址设置为普通地址
    address.update(
      {
        is_default: false,
      },
      {
        where: {
          user_id,
        },
      }
    );
  }
  await Address.updateAddress(addressInfo, user_id);
  ctx.body = new global.errs.Success("修改成功");
});

// 查询地址列表
router.post("/list", async (ctx) => {
  const { openid } = ctx.req.headers;
  const { page, pageSize } = ctx.request.body;
  const user_id = await User.getUserByOpenid(openid);
  const addressList = await Address.getAddressListByUserid(
    user_id,
    page,
    pageSize
  );
  ctx.body = addressList;
});

// 删除地址
router.delete("/delete", async (ctx) => {
  const { openid } = ctx.req.headers;
  const { id } = ctx.request.body;
  const user_id = await User.getUserByOpenid(openid);
  await Address.deleteAddress(user_id, id);
  ctx.body = new global.errs.Success("删除成功");
});

module.exports = router;
