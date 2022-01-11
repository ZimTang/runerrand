const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");
const { Order } = require("./order");

class Address extends Model {
  /**
   * 根据用户id创建地址
   * @param {Object} addressInfo 地址信息
   * @param {Number} user_id 用户id
   */
  static async createAddress(addressInfo, user_id) {
    await Address.create({ ...addressInfo, user_id });
  }

  /**
   * 根据 用户id 和 地址id 修改地址信息
   * @param {Object} addressInfo 地址信息
   * @param {Number} user_id 用户id
   */
  static async updateAddress(addressInfo, user_id) {
    await Address.update(addressInfo, {
      where: {
        id: addressInfo.id,
        user_id,
      },
    });
  }

  /**
   * 查询用户地址列表
   * @param {Number} openid openid
   * @returns 用户的地址列表
   */
  static async getAddressListByUserid(user_id, page, pageSize) {
    return await Address.findAndCountAll({
      where: {
        user_id,
      },
      // 分页
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  /**
   * 删除地址
   * @param {Number} user_id 用户id
   * @param {Number} id 地址id
   */
  static async deleteAddress(user_id, id) {
    const address = await Address.findOne({
      where: {
        id,
        user_id,
      },
    });
    if (!address) throw new global.errs.NotFound();
    // 判断订单中是否存在该地址
    const isExist = await Order.findOne({
      where: {
        id: address.getDataValue("id"),
      },
    });
    if (!isExist) {
      address.destroy();
    } else {
      throw new global.errs.DeleteError();
    }
  }
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    building: DataTypes.STRING,
    info: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN,
  },
  {
    sequelize: db,
    tableName: "address",
  }
);

Address.hasMany(Order,{
  foreignKey: "address_id",
})

module.exports = {
  Address,
};
