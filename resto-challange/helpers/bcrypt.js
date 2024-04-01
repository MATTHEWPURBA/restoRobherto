const { hashSync, compareSync } = require("bcryptjs");

module.exports = {
	//struktur hashpassowrd ini sama dengan struktur
	/** yang ada di model user hook */
	hashPassword: (password) => hashSync(password),
	//ini adalah ftur untuk menyamakan password input dan passwordDB
	comparePassword: (passwordInput, passwordDB) => compareSync(passwordInput, passwordDB),
};
