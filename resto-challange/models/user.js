"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.Cuisine, {
				foreignKey: "UserId",
			});
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				// VALIDASI DATABASE
				unique: {
					args: true,
					msg: "Email Already Exist",
				},
				//unique adalah constrain
				/** unique merupakan constrain
				 * yang berhubungan langsung
				 * dengan server
				 */

				// VALIDASI CLIENT
				validate: {
					//validate masih berhubungan dengan
					/** input dari user */
					notNull: {
						args: true,
						msg: "Email is required",
					},
					notEmpty: {
						args: true,
						msg: "Email is required",
					},
					isEmail: {
						args: true,
						msg: "Invalid Email format",
					},
					// mengenali user menggunakan format
					// email atau tidak (foo@bar.com)
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: "Password is required",
					notEmpty: "Password is rquired",
					min(value) {
						if (value < 5) {
							throw new Error("minimum character for Password is 5 char");
						}
						// args: 5,
						// msg: "minimum character for Password is 5 char ",
					},
					// minChar(value) {
					// 	if (value < 5) throw new Error("minimum character Password is 5");
					// },
				},
			},
			role: {
				type: DataTypes.STRING,
			},
			phoneNumber: DataTypes.STRING,
			address: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
			hooks: {
				beforeCreate(user) {
					// sekarang hashpassword sudah jadi function
					/** dan diletakkan di helpers sehingga
					 * tinggal dipanggil aja
					 */
					user.password = hashPassword(user.password);
					user.role = "Staff";
				},
			},
		}
	);
	return User;
};
