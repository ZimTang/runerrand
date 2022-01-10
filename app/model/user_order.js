// 用户表
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");

class User_Order extends Model {}

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
