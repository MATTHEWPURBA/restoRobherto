const { verifyWebToken } = require("../helpers/jwt");
const { User } = require("../models");
const authentication = async (req, res, next) => {
	try {
		// console.log(req.headers.authorization);
		let access_token = req.headers.authorization;
		//ini untuk ambil authorization code yang isi nya ada bearer dan kode aneh

		let [bearer, token] = access_token.split(" ");
		// ini untuk memisahkan jadi dua kalimat antara satu kata yang punya spasi
		// dijadikan array supaya jadi dua indeks dan masing masing masuk antara ke bearer /token

		if (bearer !== "Bearer") {
			/**ini adalah error handling jika salah
			 * token dan bukan bearer */
			throw { name: "InvalidToken" };
		}
		//kalo di throw itu langsung masuk ke kategori error
		//dan error nya langsung dinamain InvalidToken
		/** krena pake JWT maka token nya bearer */

		let payload = verifyWebToken(token);
		/// ini adalah sistem virifikasi antara token yang dimiliki
		/** sama input user dan hasil nya adalah
		 * { id: 14, iat: 1711518209 } (berdasarkan UserController
		 * di createWebToken)
		 *
		 */

		let user = await User.findByPk(payload.id);
		/** ini dicari dari findByPk dengan payload.id
		 * karena console.log (payload) hasilnya adalah
		 * { id: 14, iat: 1711518209 }
		 */

		//  ini adalah error handling untuk orang yang iseng
		// dengan memberikan token yang slah
		if (!user) {
			throw { name: "InvalidToken" };
		}
		// ini adalah error handling untuk orang yang iseng
		// dengan memberikan token yang slah

		// console.log(user, "<<<<<<<<<<<<INI DARI USER");
		//isi dari user adalah data yang dimiliki oleh
		/** user yang login dan data nya diambil dari db */

		//ini merupakan code yang membuat adanya object baru di req
		//berupa user:{ id: 7 } nantinya req.user ini
		//akan di passing ke controller yang menerima req.user
		req.user = {
			id: user.id,
			role: user.role,
		};
		//ini merupakan code yang membuat adanya object baru di req
		//berupa user:{ id: 7 } nantinya req.user ini
		//akan di passing ke controller yang menerima req.user

		// console.log(req, "<<<<<<<INI DARI REQ");

		// console.log(req.user, "<<<<<<<INI DARI REQ.user");
		// console.log(req.user.id, "<<<<<<<INI DARI REQ.user");

		next();
	} catch (error) {
		res.status(401).json({ message: "Unauthenticated" });
	}
};

module.exports = authentication;
