const { comparePassword } = require("../helpers/bcrypt");
const { createWebToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
	static async registerUser(req, res, next) {
		try {
			console.log(req.body);
			const userInput = await User.create(req.body);
			console.log(userInput);
			res.status(201).json({
				message: "register success",
				email: userInput.email,
			}); /** (201) karena success created */
		} catch (error) {
			next(error);
		}
	}
	static async loginUser(req, res, next) {
		try {
			let { email, password } = req.body;
			if (!email || !password) {
				throw { name: "InvalidInput" };
			}

			const user = await User.findOne({
				where: { email },
			});

			if (!user) {
				throw { name: "UserNotFound" };
			}

			let compare = comparePassword(password, user.password);

			if (!compare) {
				throw { name: "UserNotFound" };
			}

			let token = createWebToken({
				id: user.id,
			});

			res.status(200).json({
				/** kenapa yang di print cuman token aja
				 * karena kebutuhan middleware hanya butuh token nya
				 */
				// status: true,
				// message: "login successfully",
				// user: user,
				access_token: token,
			});
		} catch (error) {
			next(error);
		}
	}
}
module.exports = UserController;
