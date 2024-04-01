const request = require("supertest");
// inget kalo require pasti bakal dipake, jadi
/** kalo dia gadipake pasti ada yang salah */
const app = require("../app");
const router = require("../routes/index");
const { sequelize } = require("../models");
const { Cuisine, User } = require("../models");
let token;

beforeAll(async () => {
	try {
		const dataCuisin = require("../data/cuisine.json");
		console.log("ini dari userrrrrrr");

		/**cara 1 */
		// dataCuisin.map((el) => {
		// 	el.createdAt = new Date();
		// 	el.updatedAt = new Date();
		// 	return el;
		// });
		// await sequelize.queryInterface.bulkInsert('Cuisines',dataCuisin,{}) <<< hooks nya harus hash password sendiri

		// const user = await User.create({ email: "adminSuper@gmail.com", password: "humanSuper" });
		// console.log(user, "ini dari userrr");
		// token = user.token;
		await Cuisine.bulkCreate(dataCuisin); //kalo pake cara ini auto kena hooks password hash
	} catch (error) {
		console.log(error, "error seeding bosku");
	}
});

describe("POST/login", () => {
	test("success login", async () => {
		const user = {
			email: "adminSuper@gmail.com",
			password: "humanSuper",
		};
		const response = await request(app).post("/users/login").send(user);
		const { body, status } = response;
		token = body.access_token;
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		// expect(body).toHaveProperty("token", expect.any(String));
	});
});

test("success get /cuisine", async () => {
	const response = await request(app).get("/restaurants/pub");
	const { body, status } = response;

	// console.log(response.body, "INI BODY BOS");
	/* ini isinya object yang isi nya array */

	const { data } = response.body;

	// console.log(data, "<<<<<<<<<<ini dari response body");
	// console.log(body, "<<<<<<<<<<<<<ini dari bodyyyyy");

	expect(status).toBe(200);
	expect(body.data).toBeInstanceOf(Array);
	expect(body).toBeInstanceOf(Object);
	expect(data[0]).toHaveProperty("name", expect.any(String));
});

test("success post /cuisine", async () => {
	const dataToInsert = {
		id: 10,
		name: "Meatball",
		description: "A meatball is ground meat rolled into a ball, sometimes along with other ingredients,",
		price: 825572881,
		imgUrl: "http://dummyimage.com/242x213.png/5fa2dd/ffffff",
		CategoryId: 4,
		UserId: 3,
	};

	console.log(token);
	console.log("INI TOKEN LUARrrrrr");

	const response = await request(app)
		.post("/restaurants")
		.send(dataToInsert)
		.set("Authorization", "Bearer " + token);

	const { body, status } = response;

	expect(status).toBe(201);
	// expect(body).toBeInstanceOf(Object);
	// expect(body).toHaveProperty("description", "meatball");
});

// test("error post /cuisine name empty", async () => {
// 	const dataToInsert = {
// 		id: 10,
// 		name: "",
// 		description: "A meatball is ground meat rolled into a ball, sometimes along with other ingredients,",
// 		price: 825572881,
// 		imgUrl: "http://dummyimage.com/242x213.png/5fa2dd/ffffff",
// 		CategoryId: 4,
// 		UserId: 3,
// 	};
// 	const response = await request(app)
// 		.post("/restaurants")
// 		.send(dataToInsert)
// 		.set("Authorization", "Bearer " + token);

// 	console.log(response.body);
// 	console.log("<<<< ini dari responsedd");
// 	console.log(token);
// 	console.log("<<<< ini dari token");
// 	const { body, status } = response;

// 	expect(status).toBe(401);
// });

// test("error post /cuisine name not found", async () => {
// 	const dataToInsert = {
// 		id: 10,

// 		description: "A meatball is ground meat rolled into a ball, sometimes along with other ingredients,",
// 		price: 825572881,
// 		imgUrl: "http://dummyimage.com/242x213.png/5fa2dd/ffffff",
// 		CategoryId: 4,
// 		UserId: 3,
// 	};
// 	const response = await request(app)
// 		.post("/restaurants")
// 		.send(dataToInsert)
// 		.set("Authorization", "Bearer " + token);

// 	const { body, status } = response;

// 	expect(status).toBe(401);
// 	expect(body).toBeInstanceOf(Object);
// 	expect(body).toHaveProperty("message", "name cant be empty ");
// });

afterAll(async () => {
	try {
		/** CARA 1 */
		// await sequelize.queryInterface.bulkDelete("Cuisines", null, {
		// 	truncate: true,
		// 	cascade: true,
		// 	restartIdentity: true,
		// });
		Cuisine.destroy({
			where: {},
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});
	} catch (error) {
		console.log(error);
	}
});
