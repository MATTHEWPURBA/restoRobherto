"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const dataCuisin = require("../data/cuisine.json").map((el) => {
			el.createdAt = new Date();
			el.updatedAt = new Date();
			return el;
		});
		await queryInterface.bulkInsert("Cuisines", dataCuisin, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Cuisines", null, {
			truncate: true,
			restartIdentity: true,
		});
	},
};
