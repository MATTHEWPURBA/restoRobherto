const { Op } = require("sequelize");
const { Category } = require("../models");

class categoryController {
	static async getCategory(req, res, next) {
		try {
			let paramsQuerySQL = {};
			const { name, sort, page } = req.query;

			/** FILTERING */
			if ({ name }) {
				if (name) {
					paramsQuerySQL.where = {
						name: { [Op.iLike]: `%${name}%` },
					};
				}
			}

			/** ORDERING */

			if (sort) {
				if (sort[0] === "-") {
					const sliced = sort.slice(1);
					paramsQuerySQL = {
						order: [[sliced, "DESC"]],
					};
				} else if (sort[0] !== "-") {
					paramsQuerySQL = {
						order: [[[sort, "ASC"]]],
					};
				}
			}

			/** PAGINATION */

			let limit = 10;

			let pageNumber = 1;
			if (page) {
				if (page.size) {
					limit = page.size;

					paramsQuerySQL.limit = limit;
				}
				if (page.number) {
					pageNumber = page.number;
					paramsQuerySQL.offset = (page.number - 1) * 10;
				}
			}

			const { count, rows } = await Category.findAndCountAll(paramsQuerySQL);
			res.json({
				page: +pageNumber,
				data: rows,
				totalData: count,
				totalPage: Math.ceil(count / limit), //rumus aslinya adalah : totalData/dataPerPage
				dataPerPage: +limit,
			});
		} catch (error) {
			next(error);
		}
	}

	static async postCategory(req, res, next) {
		try {
			console.log(req.headers, "<<<<<INI REQ HEADERS CONTROLLER<<<<");
			let { name } = req.body;

			const category = await Category.create({
				name,
			});
			res.status(201).json({ message: "new category created", category });
		} catch (error) {
			next(error);
		}
	}

	static async updateCuisine(req, res, next) {
		try {
			const categoryData = await Category.findByPk(req.params.id);
			if (!categoryData) throw { name: "NotFoundCategory" };
			await Category.update(req.body, {
				where: {
					id: req.params.id,
				},
			});
			const dataBaru = await Category.findByPk(req.params.id);
			res.status(200).json({
				message: "Success Update Id " + req.params.id,
				data: dataBaru,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = categoryController;
