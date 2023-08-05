const request = require("supertest");
const { app } = require("../server");

describe("Has a homepage...", () => {
	it("...it responds with status 200.", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toEqual(200);
	});

	it("...it responds wtih a JSON object", async () => {
		const response = await request(app).get("/");
		const responseBodyDataType = typeof response.body;

		expect(responseBodyDataType).toEqual("object");
	});
});

describe("Classes...", () => {
	describe("...can be added...", () => {
		// expect an object on the response with class data
	});

	describe("...can be retrieved...", () => {
		// expect an object on the response with class data
	});

	describe("...can be updated...", () => {
		// update class and expect response with updated class data
	});

	describe("...can be deleted...", () => {
		// expect that class will be deleted
	});
});

describe("User...", () => {
	describe("...can sign up...", () => {
		it("...with a valid email address and password", async () => {
			// expect an object on the response with user data
			const response = (await request(app).post("/users/signup")).send({
				email: "test",
				password: "test",
			});

			expect(response.body).toEqual({ message: "Sign up success!" });
		});
	});

	describe("...can NOT sign up...", () => {
		it("...with an invalid eamil address", async () => {
			// expect one error on the response
		});

		it("...with an invalid password", async () => {
			// expect one error on the response
		});

		it("...with an invalid email address and invalid password", async () => {
			// expect two errors on the response
		});
	});

	describe("...can be updated...", () => {
		it("...with a new email address", async () => {
			// expect new email address on response
		});
		it("...with a new password", async () => {
			// expect new password on response
		});
	});

	it("...can be deleted", async () => {
		// expect user to be deleted
	});
});
