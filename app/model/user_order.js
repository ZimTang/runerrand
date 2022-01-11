// 用户表
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");

class User_Order extends Model {
  /**
   * 查询帮助订单列表的所有id
   * @param {Number} user_id 用户id
   * @returns 帮助的订单的id
   */
  static async getHelpOrderListByUserId(user_id, page, pageSize) {
    const helpOrderList = await User_Order.findAll({
      where: {
        helper_id: user_id,
      },
      // 分页
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const helpOrderIdList = helpOrderList.map(item => {
      return item.getDataValue('order_id')
    })
    console.log(helpOrderIdList)
    return helpOrderIdList;
  }

  /**
   * 获得发起订单用户的id
   * @param {Number} order_id 订单id
   * @returns 发起订单用户的id
   */
  static async getUserIdByOrderId(order_id) {
    const user = await User_Order.findOne({
      where: {
        order_id,
      },
    });
    return user.getDataValue("user_id");
  }

  /**
   * 插入接单数据
   * @param {Order} order 订单对象
   * @param {Number} helper_id 接单人id
   */
  static async accpetOrder(order, helper_id) {
    // 更新订单
    await order.update({
      helper_id,
      state: 1,
    });

    await User_Order.update(
      {
        helper_id,
      },
      {
        where: {
          order_id: order.getDataValue("id"),
        },
      }
    );
  }
}

User_Order.init(
  {
    order_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    helper_id: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    tableName: "user_order",
  }
);

module.exports = {
  User_Order,
};
