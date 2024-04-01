const adminOnly = async (req, res, next) => {
	try {
		if (req.user.role === "Admin") {
			next();
		} else {
			throw {
				name: "NotAdmin",
			};
		}
	} catch (error) {
		next(error);
	}
};

module.exports = adminOnly;
