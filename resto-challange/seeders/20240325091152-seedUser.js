"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const dataUser = require("../data/user.json").map((el) => {
			el.createdAt = new Date();
			el.updatedAt = new Date();
			/** BUAT HASH PAASSWORD SEBELUM SEEDING UNTUK BISA BEDAIN ADMIN DAN JUGA STAFF */
			el.password = hashPassword(el.password);
			return el;
		});
		await queryInterface.bulkInsert("Users", dataUser, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Categories", null, {
			truncate: true,
			restartIdentity: true,
		});
	},
};

// {
// 	sequelize,
// 	modelName: "User",
// 	hooks: {
// 		beforeCreate(user) {
// 			// sekarang hashpassword sudah jadi function
// 			/** dan diletakkan di helpers sehingga
// 			 * tinggal dipanggil aja
// 			 */
// 			user.password = hashPassword(user.password);
// 			user.role = "Staff";
// 		},
// 	},
// }
