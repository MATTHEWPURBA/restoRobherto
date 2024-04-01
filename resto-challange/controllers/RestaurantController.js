const { Op } = require("sequelize");
const { Cuisine } = require("../models");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

class restaurantController {
	static async getCuisines(req, res, next) {
		try {
			let paramsQuerySQL = {};
			const { UserId, CategoryId, sort, page } = req.query;
			console.log(req.query);
			console.log("<<iniii dari req.query>>");

			/** FILTERING */
			if ({ UserId, CategoryId }) {
				if (UserId) {
					paramsQuerySQL.where = {
						UserId: { [Op.eq]: UserId },
					};
				}

				if (CategoryId) {
					paramsQuerySQL.where = {
						CategoryId: { [Op.eq]: CategoryId },
					};
				}
			}

			/**ORDERING */

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

			const { count, rows } = await Cuisine.findAndCountAll(paramsQuerySQL);
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

	static async postCuisine(req, res, next) {
		try {
			let { name, description, price, imgUrl, CategoryId, UserId } = req.body;

			const cuisine = await Cuisine.create({
				name,
				description,
				price,
				imgUrl,
				CategoryId,
				UserId: req.user.id,
			});

			res.status(201).json({ message: "new cuisine created", cuisine });
		} catch (error) {
			next(error);
		}
	}
	static async getCuisineById(req, res, next) {
		try {
			const cuisineData = await Cuisine.findByPk(req.params.id);

			if (!cuisineData)
				throw {
					name: "NotFound",
				};
			res.status(200).json(cuisineData);
		} catch (error) {
			next(error);
		}
	}
	static async updateCuisine(req, res, next) {
		try {
			const cuisineData = await Cuisine.findByPk(req.params.id);
			//kenapa params.id karena didapat dari route nya "restaurants/:id"

			// if (!cuisineData) {
			// 	return res.status(404).json({ message: "Cuisine doesnt not exist" });
			// }
			//gaboleh mengirim dua res(ponse) yang sama di satu function
			//minimal harus di return

			if (!cuisineData)
				throw {
					name: "NotFound",
				};

			console.log(cuisineData);
			// dibikin destructure gini biar bisa disatuin error nya di catch

			await Cuisine.update(req.body, {
				where: {
					id: req.params.id,
				},
			});

			/** data find by pk setelah update udah auto ke update beda
			 * dengan find by pk yang diatas
			 */
			const dataBaru = await Cuisine.findByPk(req.params.id);

			res.status(200).json({
				message: "Success update id " + req.params.id,
				data: dataBaru,
			});
		} catch (error) {
			next(error);
		}
	}
	static async deleteCuisine(req, res, next) {
		try {
			const cuisineData = await Cuisine.findByPk(req.params.id);

			if (!cuisineData)
				throw {
					name: "NotFound",
				};

			// await Cuisine.destroy( {
			// 	where: {
			// 		id: req.params.id,
			// 	},
			// });

			cuisineData.destroy();

			res.status(200).json({
				message: "Success delete id " + req.params.id,
			});
		} catch (error) {
			next(error);
		}
	}
	static async patchCuisineById(req, res, next) {
		try {
			const cuisineData = await Cuisine.findByPk(req.params.id);
			//kenapa params.id karena didapat dari route nya "restaurants/:id"

			// if (!cuisineData) {
			// 	return res.status(404).json({ message: "Cuisine doesnt not exist" });
			// }
			//gaboleh mengirim dua res(ponse) yang sama di satu function
			//minimal harus di return

			if (!cuisineData)
				throw {
					name: "NotFound",
				};
			// dibikin destructure gini biar bisa disatuin error nya di catch

			// await Cuisine.update(req.body, {
			// 	where: {
			// 		id: req.params.id,
			// 	},
			// });

			cuisineData.update(req.body);

			res.status(200).json({
				message: "Success update Patch name" + " dengan id " + req.params.id,
			});
		} catch (error) {
			next(error);
		}
	}

	static async patchImgCuisineById(req, res, next) {
		try {
			console.log(req.body, "ini req body");
			console.log(req.file, "ini req file");

			const cuisineId = req.params.id;
			const cuisine = await Cuisine.findByPk(req.params.id);

			if (!cuisine) {
				throw { name: "NotFound", message: `Cuisine with id : ${cuisineId} not found` };
			}

			if (!req.file) {
				throw { name: "FileRequired" };
			}

			const base64String = req.file.buffer.toString("base64");
			// console.log(base64String);

			//data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==
			/** const dibawah merupakan hasil modifikasi kodingan diatas*/
			const dataUrl = `data:${req.file.mimetype};base64,${base64String}`;

			console.log(dataUrl, "<<<<<<<<<INI DARI DATA URL");

			//pake await karena susunan file asli nya pake chaining.
			const result = await cloudinary.uploader.upload(dataUrl, {
				//public id = original name
				/** karena isi dari data url mengandung original name yang
				 * berisi nama file
				 */
				public_id: req.file.originalname,
				folder: "rmt-47",
			});

			//bisa langsung update dari atas
			await cuisine.update({
				imgUrl: result.secure_url,
			});
			console.log(result);

			/**
			 * cloudinary.uploader
			.upload("my_image.jpg")
			.then(result=>console.log(result));
			 */

			res.status(200).json({
				message: "Success update Patch Image" + " dengan id " + req.params.id,
			});
		} catch (error) {
			next(error);
		}
	}
}
module.exports = restaurantController;
