// 快递商家
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");

class ParcelAddress extends Model {}

ParcelAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    tableName: "parceladdress",
  }
);

module.exports = {
  ParcelAddress,
};
