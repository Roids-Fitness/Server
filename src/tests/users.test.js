const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();
const { app } = require("../server");
const mongoose = require('mongoose');


const moment = require('moment-timezone');
const Class = require('../models/class');
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
				email: "testuser@test.com",
				password: "testpassword",
			};
			const response = await request(app).post("/user/register").send(newUser);
			expect(response.status).toBe(201);
			expect(response.body.message).toBe("Signup success!");
		});

		it("...cannot sign up if email address or password are not provided.", async () => {
			const incompleteUser = {
				email: "missingpassword@test.com",
			};
			const response = await request(app).post("/user/register").send(incompleteUser);
			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Email and password must be provided");
		});

		it("...cannot register if the email address already exists in the database", async () => {
			const existingUser = {
				email: "testuser@test.com",
				password: "testpassword",
			};
			// Assuming first registration was successful in a previous test
			const response = await request(app).post("/user/register").send(existingUser);
			expect(response.status).toBe(409);
			expect(response.body.error).toBe("Email already registered");
		});

		

		it("...should be provided with valid user details on successful registration", async () => {
			const newUserDetails = {
				firstName: "John",
				lastName: "Smith",
				email: "johnsmith@test.com",
				password: "password",
				street: "123 Fake St",
				suburb: "Indooroopillu",
				state: "QLD",
				postcode: "4389",
				mobile: "0475869088"
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

	describe("...can log in...", () => {
		it("...with valid credentials and returns JWT token", async () => {
			const credentials = {
				email: "testuser@test.com",
				password: "testpassword",
			};
			const response = await request(app).post("/user/login").send(credentials);
			console.log(response.body);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe("Login success!");
			expect(response.body.token).toBeDefined();

		});



		it("...cannot log in with incorrect credentials", async () => {
			const wrongCredentials = {
				email: "testuser@test.com",
				password: "wrongpassword",
			};
			const response = await request(app).post("/user/login").send(wrongCredentials);
			expect(response.status).toBe(401);
			expect(response.body.error).toBe("Authentication failed. Wrong email or password.");
		});

	});

	describe("...during login...", () => {
		it("...cannot login without an email or password", async () => {
			const incompleteCredentials = {
				email: "test@test.com",
			};
			const response = await request(app).post("/user/login").send(incompleteCredentials);
			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Email and password are required to login");
		});
	});

	describe("getUserByID", () => {
		it("should return user details without admin status", async () => {
	
			const credentials = {
				email: "testuser@test.com",
				password: "testpassword",
			};
	
			const loginresponse = await request(app).post("/user/login").send(credentials);
	
			// Ensure login was successful
			expect(loginresponse.status).toBe(200);
			expect(loginresponse.body).toHaveProperty("user");
			expect(loginresponse.body.user).toHaveProperty("id");
	
			// Extract token
			const token = loginresponse.body.token;
	
			// Use the token to make a request to getUserByID endpoint
			const response = await request(app)
				.get("/user/myaccount")  // replace this with your actual endpoint for getUserByID
				.set("Authorization", `Bearer ${token}`);  // set the JWT as an Authorization header
	
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("email");
			expect(response.body).toHaveProperty("password"); 
			expect(response.body).toHaveProperty("savedClasses");   
			expect(response.body).not.toHaveProperty("isAdmin");
		});
	});


	describe("getMyClasses", () => {
		it("Can view saved classes for the user.", async () => {
	
			const credentials = {
				email: "test1@email.com",
				password: "test123",
			};
	
			const loginresponse = await request(app).post("/user/login").send(credentials);
	
			// Ensure login was successful
			expect(loginresponse.status).toBe(200);
			expect(loginresponse.body).toHaveProperty("user");
			expect(loginresponse.body.user).toHaveProperty("id");
	
			// Extract token
			const token = loginresponse.body.token;
	
			// Use the token to make a request to getUserByID endpoint
			const response = await request(app)
			.get("/user/myclasses")  // replace this with your actual endpoint for getUserByID
			.set("Authorization", `Bearer ${token}`);  // set the JWT as an Authorization header

			expect(response.status).toBe(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body[0]).toHaveProperty("title");
			expect(response.body[0]).toHaveProperty("description");
			expect(response.body[0]).toHaveProperty("startTime");
			expect(response.body[0]).toHaveProperty("endTime");
			expect(response.body[0]).toHaveProperty("trainer");
		});
	});

	describe("updateUser", () => {
		it("should successfully update the user's details", async () => {
			
			const credentials = {
				email: "test1@email.com",
				password: "test123",
			};
	
			const loginresponse = await request(app).post("/user/login").send(credentials);
			
			// Ensure login was successful
			expect(loginresponse.status).toBe(200);
			expect(loginresponse.body).toHaveProperty("user");
			expect(loginresponse.body.user).toHaveProperty("id");
			
			// Extract token and user ID
			const token = loginresponse.body.token;
			const userId = loginresponse.body.user.id;
			
			// Update data
			const updatedData = {
				firstName: "New",
				lastName: "New",
				email: "newtest@email.com",
				street: "New",
				suburb: "New",
				state: "TAS",
				postcode: "7777",
				mobile: "New"
			};
			
			// Use the token to make a request to updateUser endpoint
			const response = await request(app)
				.put(`/user/${userId}`) 
				.set("Authorization", `Bearer ${token}`)  // set the JWT as an Authorization header
				.send(updatedData);
			
			// Check if the update was successful
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("message", "User updated successfully");
			
			// Check the updated data
			expect(response.body.data).toHaveProperty("firstName", "New");
			expect(response.body.data).toHaveProperty("lastName", "New");
			expect(response.body.data).toHaveProperty("email", "newtest@email.com");
			expect(response.body.data).toHaveProperty("street", "New");
			expect(response.body.data).toHaveProperty("suburb", "New");
			expect(response.body.data).toHaveProperty("state", "TAS");
			expect(response.body.data).toHaveProperty("postcode", "7777");
			expect(response.body.data).toHaveProperty("mobile", "New");
		});
	});
	


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

	afterAll(async () => {
		await mongoose.connection.close();
	  });

});


