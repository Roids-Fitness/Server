const request = require("supertest");
const { app } = require("../server");
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const Class = require('../models/class');
jest.mock('jsonwebtoken');
jest.mock('../models/class');
const express = require("express");
const usersRouter = express.Router();
const {
	login,
	updateUser,
	deleteUser,
	register,
	getUserByID,
	getMyClasses,
} = require("../controllers/users_controller");
const {
	validateRequest,
	validateAdmin,
} = require("../middlewares/auth_middleware");

describe("User...", () => {

	describe("...can register for an account...", () => {

		it("...with a valid email address and password", async () => {
			const newUser = {
				email: "test@test.com",
				password: "testpassword",
			};
			const response = await request(app).post("/user/register").send(newUser);
			expect(response.status).toBe(201);
			expect(response.body.message).toBe("Signup success!");
		});

		it("...cannot sign up if email address or password are not provided.", async () => {
			const incompleteUser = {
				email: "missingpass@test.com",
			};
			const response = await request(app).post("/user/register").send(incompleteUser);
			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Email and password must be provided");
		});

		it("...cannot sign up if the email address already exists in the database", async () => {
			const existingUser = {
				email: "test@test.com",
				password: "securepassword",
			};
			// Assuming first registration was successful in a previous test
			const response = await request(app).post("/user/register").send(existingUser);
			expect(response.status).toBe(409);
			expect(response.body.error).toBe("Email already registered");
		});

		it("...should be provided with valid user details on successful registration", async () => {
			const newUserDetails = {
				firstName: "John",
				lastName: "Doe",
				email: "johndoe@test.com",
				password: "johndoepassword",
				street: "123 Elm St",
				suburb: "Downtown",
				state: "LA",
				postcode: "90210",
				mobile: "123-456-7890"
			};
			const response = await request(app).post("/user/register").send(newUserDetails);
			expect(response.status).toBe(201);
			expect(response.body.user.email).toBe(newUserDetails.email);
			expect(response.body.user.firstName).toBe(newUserDetails.firstName);
			expect(response.body.user.lastName).toBe(newUserDetails.lastName);
			expect(response.body.user.street).toBe(newUserDetails.street);
			expect(response.body.user.suburb).toBe(newUserDetails.suburb);
			expect(response.body.user.state).toBe(newUserDetails.state);
			expect(response.body.user.postcode).toBe(newUserDetails.postcode);
			expect(response.body.user.mobile).toBe(newUserDetails.mobile);
		});

	})

	// describe("...can log in...", () => {
	// 	it("...with valid credentials", async () => {
	// 		const credentials = {
	// 			email: "test@test.com",
	// 			password: "securepassword",
	// 		};
	// 		const response = await request(app).post("/user/login").send(credentials);
	// 		expect(response.status).toBe(200);
	// 		expect(response.body.message).toBe("Login successful!");
	// 		// Assuming the login route returns a token, you could check for its existence
	// 		expect(response.body.token).toBeDefined();
	// 	});

	// 	it("...cannot log in with incorrect credentials", async () => {
	// 		const wrongCredentials = {
	// 			email: "test@test.com",
	// 			password: "wrongpassword",
	// 		};
	// 		const response = await request(app).post("/user/login").send(wrongCredentials);
	// 		expect(response.status).toBe(401);
	// 		expect(response.body.error).toBe("Authentication failed");
	// 	});

	// });

	// describe("...can view profile...", () => {
	// 	it("...of the authenticated user", async () => {
	// 		// Assuming you have a mechanism to authenticate the user and obtain a token
	// 		const token = "userAuthToken";
	// 		const response = await request(app).get("/user/myaccount")
	// 			.set("Authorization", `Bearer ${token}`);
	// 		expect(response.status).toBe(200);
	// 		expect(response.body.email).toBe("test@test.com");
	// 	});
	// });

	// describe("...can view saved classes...", () => {
	// 	it("...of the authenticated user", async () => {
	// 		const token = "userAuthToken";
	// 		const response = await request(app).get("/user/myclasses")
	// 			.set("Authorization", `Bearer ${token}`);
	// 		expect(response.status).toBe(200);
	// 		// Assuming you want to check if the response is an array
	// 		expect(Array.isArray(response.body)).toBe(true);
	// 	});
	// });

	// describe("...can update profile...", () => {
	// 	it("...of the authenticated user", async () => {
	// 		const token = "userAuthToken";
	// 		const updateData = {
	// 			firstName: "UpdatedFirstName",
	// 			lastName: "UpdatedLastName"
	// 		};
	// 		const userId = "someUserId"; // Assuming you have this ID
	// 		const response = await request(app).put(`/user/${userId}`)
	// 			.set("Authorization", `Bearer ${token}`)
	// 			.send(updateData);
	// 		expect(response.status).toBe(200);
	// 		expect(response.body.firstName).toBe(updateData.firstName);
	// 		expect(response.body.lastName).toBe(updateData.lastName);
	// 	});
	// });

	// describe("...admin can delete users...", () => {
	// 	it("...by ID", async () => {
	// 		// Assuming you have a mechanism to authenticate the admin and obtain a token
	// 		const adminToken = "adminAuthToken";
	// 		const userIdToDelete = "userIdToDelete"; // Assuming you have this ID
	// 		const response = await request(app).delete(`/user/${userIdToDelete}`)
	// 			.set("Authorization", `Bearer ${adminToken}`);
	// 		expect(response.status).toBe(200);
	// 		expect(response.body.message).toBe("User successfully deleted");
	// 	});
	// });

	// describe("...during sign up...", () => {
	// 	it("...cannot register with an already used email address", async () => {
	// 		const existingUser = {
	// 			email: "test@test.com",
	// 			password: "securepassword",
	// 		};
	// 		const response = await request(app).post("/user/register").send(existingUser);
	// 		expect(response.status).toBe(409);
	// 		expect(response.body.error).toBe("Email already registered");
	// 	});
	// });

	// describe("...during login...", () => {
	// 	it("...cannot login without an email or password", async () => {
	// 		const incompleteCredentials = {
	// 			email: "test@test.com",
	// 		};
	// 		const response = await request(app).post("/user/login").send(incompleteCredentials);
	// 		expect(response.status).toBe(400);
	// 		expect(response.body.error).toBe("Email and password are required to login");
	// 	});
	// });

	
	// describe("...when fetching user details...", () => {
	// 	it("...returns an error if user ID is not found", async () => {
	// 		const fakeId = "someNonExistentId";
	// 		const response = await request(app).get(`/user/${fakeId}`);
	// 		expect(response.status).toBe(404);
	// 		expect(response.body.error).toBe("User ID not found");
	// 	});
	// });

	// describe("...when updating user...", () => {
	// 	it("...returns an error if user ID is not found", async () => {
	// 		const fakeId = "someNonExistentId";
	// 		const updateData = { firstName: "UpdatedName" };
	// 		const response = await request(app).put(`/user/${fakeId}`).send(updateData);
	// 		expect(response.status).toBe(404);
	// 		expect(response.body.error).toBe("User ID not found");
	// 	});
	// });

	// describe("...when deleting a user...", () => {
	// 	it("...returns an error if user ID is not found", async () => {
	// 		const fakeId = "someNonExistentId";
	// 		const response = await request(app).delete(`/user/${fakeId}`);
	// 		expect(response.status).toBe(404);
	// 		expect(response.body.error).toBe("User ID not found");
	// 	});
	// });	
	

});
