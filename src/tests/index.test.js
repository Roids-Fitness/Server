const request = require('supertest');
const {app} = require("../server");

describe("Has a homepage...", () => {

	it("...it responds with status 200.", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toEqual(200);
	})

	it("...it responds wtih a JSON object", async () => {
		const response = await request(app).get("/");
		const responseBodyDataType = typeof(response.body);

		expect(responseBodyDataType).toEqual("object");
	})
})