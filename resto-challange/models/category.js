"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		static associate(models) {
			Category.hasMany(models.Cuisine,{
				foreignKey:"CategoryId"
			});
		}
	}
	Category.init(
		{
			name: {
				type: DataTypes.STRING,
				//ALLOWNULL :FALSE ITU HARUS GABUNG
				// SAMA VALIDATE NOT NULL DAN NOT EMPTY
				// JADI KALO ADA VALIDATE NOTNULL DAN NOTEMPTY
				//HARUS ADA ALLOWNULL:FALSE
				allowNull: false,
				validate: {
					notNull: {
						arg: true,
						msg: "name cant be empty",
					},
					notEmpty: {
						arg: true,
						msg: "name cant be empty",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Category",
		}
	);
	return Category;
};
