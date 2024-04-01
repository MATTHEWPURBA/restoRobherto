function errorHandler(error, req, res, next) {
	let status = error.status;
	let message = error.message;

	//error.name ini langsung nyatu sama controller nya
	/** dan error.name nya udah di setting
	 * jadi case nya tuh merupakan error.name nya
	 * dan variasi variasi nya dan akan berjalan case nya
	 * tergantung dari error.name nya
	 */
	switch (error.name) {
		case "InvalidInput":
			status = 400;
			message = "Email/Password is required";
			break;

		case "SequelizeValidationError":
		case "SequelizeUniqueConstraintError":
			status = 400;
			message = error.errors.map((el) => el.message);
			break;

		case "UserNotFound":
			status = 401;
			message = "Invalid input Email/Password";
			break;

		case "FileRequired":
			status = 404;
			message = "File is Required";
			break;

		case "CuisineNotFound":
			status = 403;
			message = "Cuisine Not Found";
			break;

		case "ForbiddenAuth":
			status = 403;
			message = "Forbidden to access Cuisine";
			break;

		case "NotFound":
			status = 404;
			message = "Cuisine Not Found";
			break;

		case "NotFoundCategory":
			status = 404;
			message = "Category Not Found";
			break;

		case "NotAdmin":
			status = 401;
			message = "Admin Login is required";
			break;

		case "Category/UserNotFound":
			status = 404;
			message = "Category / User Not Found";
			break;

		default:
			console.log(error);
			console.log("<<<<<<<<<<ini error");
			res.status(500).json({ message: "Internal Server Error" });
			break;
	}

	//ini biar status nya keliatan di json
	/** nantinya si message yang udah disiapkan di switch case
	 * baru dioper pake kode dibawah ini
	 */
	res.status(status).json({
		//ini biar keliatan error message nya keliatan di postman
		message,
	});
}

module.exports = errorHandler;
