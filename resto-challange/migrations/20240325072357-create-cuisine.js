"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Cuisines", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.STRING,
			},
			price: {
				type: Sequelize.INTEGER,
			},
			imgUrl: {
				type: Sequelize.STRING,
			},
			CategoryId: {
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: "Categories",
						key: "id",
					},
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			UserId: {
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: "Users",
						key: "id",
					},
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Cuisines");
	},
};
