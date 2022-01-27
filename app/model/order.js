// 订单表
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");
const { Category } = require("./category");
const { ParcelAddress } = require("./parcelAddress");
const { User_Order } = require("./user_order");
class Order extends Model {
  /**
   * 创建订单
   * @param {Number} user_id 用户id
   * @param {Object} orderInfo 订单信息
   * @param {Number} category_id 分类id
   */
  static async createOrder(user_id, orderInfo, category_id) {
    return await Order.create({ ...orderInfo, user_id, category_id });
  }

  /**
   * 根据user_id获取我的订单列表
   * @param {Number} openid openid
   * @returns 订单列表
   */
  static async getOrderByOpenid(user_id, page, pageSize) {
    const orderIdList = await User_Order.findAll({
      where: {
        user_id,
      },
      attributes: ["order_id"],
      // 分页
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const orderList = [];
    for (let i = 0; i < orderIdList.length; i++) {
      orderList.push(
        await Order.findOne({
          where: {
            id: orderIdList[i].getDataValue("order_id"),
          },
          include: [
            {
              model: require("./parcelAddress").ParcelAddress,
            },
            {
              model: require("./address").Address,
            },
            {
              model: require("./category").Category,
            },
          ],
        })
      );
    }
    /* 
      todo: 
          1.查出来的是helper的id 而不是用户名
          2.address和parcel_address查出来的都是id
    */
    return orderList;
  }

  /**
   * 根据状态获取订单列表
   * @param {Number} page 分页页码
   * @param {Number} pageSize 单页数量
   * @returns 符合状态的订单表
   */
  static async getOrderListByState(state, page, pageSize) {
    return await Order.findAll({
      where: {
        state: state,
      },
      include: [
        {
          model: require("./parcelAddress").ParcelAddress,
        },
        {
          model: require("./address").Address,
        },
        {
          model: require("./category").Category,
        },
      ],
      // 分页
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  /**
   * 根据订单id获取订单
   * @param {Number} id 订单id
   * @returns 订单
   */
  static async getOrderById(id) {
    return await Order.findOne({
      where: {
        id,
      },
    });
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 快递大小
    size: DataTypes.INTEGER,
    // 内容
    info: DataTypes.STRING,
    // 备注
    remark: DataTypes.TEXT,
    // 期望送达
    expected: DataTypes.INTEGER,
    // 性别限制
    sex: DataTypes.BOOLEAN,
    // 快递数量
    quantity: DataTypes.INTEGER,
    // 是否紧急
    urgent: DataTypes.BOOLEAN,
    // 赏金
    bounty: DataTypes.INTEGER,
    // 支付金额
    money: DataTypes.INTEGER,
    // 分类
    category: DataTypes.STRING,
    /* 
      接单状态 0为未接单 1为已接单但未完成 2为已完成
    */
    state: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    tableName: "order",
  }
);
// 快递地址
Order.belongsTo(ParcelAddress, {
  foreignKey: "parcel_address_id",
});

// order 与 user 表关联
Order.hasMany(User_Order, {
  foreignKey: "order_id",
});

User_Order.belongsTo(Order, {
  foreignKey: "order_id",
});

Order.belongsTo(Category, {
  foreignKey: "category_id",
});
module.exports = {
  Order,
};
