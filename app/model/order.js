// 订单表
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");
const { ParcelAddress } = require("../model/parcel-address");
const { Address } = require("./address");
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
   * 根据openid获取我的订单列表
   * @param {Number} openid openid
   * @returns 订单列表
   */
  static async getOrderByOpenid(user_id) {
    const orderList = await Order.findAll({
      where: {
        user_id,
      },
    });
    /* 
      todo: 
          1.查出来的是helper的id 而不是用户名
          2.address和parcel_address查出来的都是id
          3.未做分页
    */

    return orderList;
  }

  /**
   * 获取未完成的订单表
   * @returns 未完成的订单表
   */
  static async getUnfinishedOrder() {
    const unfinishedOrderList = await Order.findAll({
      where: {
        isFinish: false,
      },
    });
    /* 
      todo: 
          1.查出来的是helper的id 而不是用户名
          2.address和parcel_address查出来的都是id
          3.未做分页
    */
    return unfinishedOrderList;
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
    // 是否完成
    isFinish: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "order",
  }
);

// 快递地址
Order.belongsTo(ParcelAddress);
// 收件地址
Order.belongsTo(Address);

// order 与 user 表关联
Order.hasMany(User_Order, {
  foreignKey: "order_id",
});

User_Order.belongsTo(Order, {
  foreignKey: "order_id",
});

module.exports = {
  Order,
};
