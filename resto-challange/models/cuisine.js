"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Cuisine extends Model {
		static associate(models) {
			Cuisine.belongsTo(models.Category, {
				foreignKey: "CategoryId",
			});
			Cuisine.belongsTo(models.User, {
				foreignKey: "UserId",
			});
		}
	}
	Cuisine.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "name cant be empty",
					},
					notEmpty: {
						msg: "name cant be empty",
					},
				},
			},

			description: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "description cant be empty",
					},
					notEmpty: {
						msg: "description cant be empty",
					},
				},
			},

			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Price cant be empty",
					},
					notEmpty: {
						msg: "price cant be empty",
					},
					//aslinya min aja cuman bisa
					min: {
						args: 50000,
						msg: "Price should be higher than 5000",
					},
				},
			},
			imgUrl: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "image URL is required",
					},
					notEmpty: {
						args: true,
						msg: "image URL is required",
					},
				},
			},

			CategoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "image URL is required",
					},
					notEmpty: {
						args: true,
						msg: "image URL is required",
					},
				},
			},

			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "image URL is required",
					},
					notEmpty: {
						args: true,
						msg: "image URL is required",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Cuisine",
		}
	);
	return Cuisine;
};
