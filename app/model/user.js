// 用户表
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");
const { Address } = require("./address");
const { User_Order } = require("./user_order");

class User extends Model {
  /**
   * 根据openid查询用户id
   * @param {number} openid
   * @returns 用户id
   */
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid,
      },
      attributes: ["id"],
    });
    if (!user) {
      throw new global.errs.NotFound();
    }
    return user.getDataValue("id");
  }

  /**
   * 更新用户信息
   * @param {Number} openid
   * @param {Object} userInfo 用户信息
   */
  static async updateUser(openid, userInfo) {
    User.update(userInfo, {
      where: {
        openid,
      },
    });
  }

  /**
   * 插入用户信息
   * @param {Number} openid
   * @param {Object} userInfo 用户信息
   */
  static async createUser(openid, userInfo) {
    const user_id = await User.findOne({
      where: {
        openid,
      },
    });
    if (user_id) return;
    User.create({ ...userInfo, openid });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nick_name: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING,
    is_helper: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    openid: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: db,
    tableName: "user",
  }
);

// 地址一对多关系
User.hasOne(Address, {
  foreignKey: "user_id",
});

// order 与 user 表关联
User.hasMany(User_Order, {
  foreignKey: "user_id",
});

User_Order.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = {
  User,
};
