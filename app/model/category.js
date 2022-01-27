// 分类表
const { DataTypes, Model } = require("sequelize");
const { db } = require("../../core/db");

class Category extends Model {
  /**
   *
   * @param {string} name 分类名称
   * @returns 分类id
   */
  static async getCateIdByName(name) {
    const category = await Category.findOne({
      attributes: ["id"],
      where: {
        name,
      },
    });
    if (!category) throw new global.errs.NotFound("分类未找到");
    return category.dataValues.id;
  }
}

Category.init(
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
    tableName: "category",
  }
);

module.exports = {
  Category,
};
