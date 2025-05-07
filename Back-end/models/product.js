const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Product name cannot be empty",
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "Price must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "Price must be greater than or equal to 0",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "https://via.placeholder.com/150",
        validate: {
          isUrl: {
            msg: "Image URL must be a valid URL",
          },
        },
      },
    },
    {
      timestamps: true,
      tableName: "products",
      indexes: [
        {
          name: "products_name_idx",
          fields: ["name"],
        },
      ],
    }
  );

  return Product;
};
