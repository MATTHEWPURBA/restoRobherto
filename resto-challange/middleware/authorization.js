const { verifyWebToken } = require("../helpers/jwt");
const { Cuisine, User } = require("../models");
const authorization = async (req, res, next) => {
	//biar cuisiness.userId bisadipake baik di try dan catch
	/** maka taro await nya diluar try */

	try {
		/** kalo ada yang login nanti si admin bisa ketauan
		 *  dengan cara req.admin user
		 */
		if (req.user.role === "Admin") {
			next();
		} else {
			let cuisiness = await Cuisine.findByPk(req.params.id);
			// console.log(req.params)
			if (!cuisiness) {
				throw {
					name: "CuisineNotFound",
				};
			}
			if (cuisiness.UserId !== req.user.id) {
				throw {
					name: "ForbiddenAuth",
				};
			}

			next();
		}
	} catch (error) {
		next(error);
	}
};

module.exports = authorization;
