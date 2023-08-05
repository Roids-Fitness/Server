const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const Class = require("../models/class");
const User = require("../models/user");

describe("Application has a homepage...", () => {
	it("...it responds with status 200.", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toEqual(200);
	});

	it("...it responds wtih a JSON object", async () => {
		const response = await request(app).get("/");
		const responseBodyDataType = typeof response.body;
		expect(responseBodyDataType).toEqual("object");
	});
	afterAll(async () => {
		await mongoose.connection.close();
	});
});

describe("Class Controller", () => {
	describe("getAllClasses()", () => {
		beforeAll(async () => {
			// Connect to test MongoDB
			await mongoose.connect(
				"mongodb://localhost:27017/roids_fitness_db_test",
				{
					useNewUrlParser: true,
					useUnifiedTopology: true,
				}
			);

			// Create some sample class for testing
			await Class.create({
				title: "Bill Bob Class",
				description: "Bill Bob Class",
				startTime: new Date(),
				endTime: new Date(),
				trainer: "Bill Bob",
			});
		});

		it("should return all classes if no trainer query is provided", async () => {
			const response = await request(app).get("/class");
			expect(response.status).toBe(200);
			expect(response.body.length).toBe(301); // Initial seed is 300 classes. So add 1 is 301.
		});

		it("should return classes associated with a particular trainer when trainer query is provided", async () => {
			const response = await request(app).get("/class?trainer=Bill Bob");
			expect(response.status).toBe(200);
			expect(response.body.length).toBe(1);
			expect(response.body[0].trainer).toBe("Bill Bob");
		});
	});

	describe("getClassByID()", () => {
		let testClassId;

		beforeAll(async () => {
			// Create a sample class for testing
			const createdClass = await Class.create({
				title: "Sample Yoga Class",
				description: "Test Yoga Class",
				startTime: new Date(),
				endTime: new Date(),
				trainer: "Test Trainer",
			});

			testClassId = createdClass._id;
		});

		afterAll(async () => {
			// Cleanup: delete the test class created
			await Class.findByIdAndDelete(testClassId);
		});

		it("should fetch class details using the provided class ID", async () => {
			const response = await request(app).get(`/class/${testClassId}`);

			expect(response.status).toBe(200);
			expect(response.body._id).toEqual(String(testClassId));
			expect(response.body.title).toBe("Sample Yoga Class");
		});
	});

	describe("createClass functionality", () => {
		let token; // for storing the token from login

		// Create a sample overlapping class for testing overlap scenario
		beforeAll(async () => {
			await Class.create({
				title: "Overlap Class",
				description: "This class is for testing overlaps",
				startTime: new Date("2023-08-10T10:00:00Z"),
				endTime: new Date("2023-08-10T11:00:00Z"),
				trainer: "Overlap Trainer",
			});

			// Log in as an admin user
			const credentials = {
				email: "admin1@admin.com",
				password: process.env.ADMIN_PASSWORD,
			};

			const loginresponse = await request(app)
				.post("/user/login")
				.send(credentials);

			// Extract token
			token = loginresponse.body.token;
		});

		it("should create a new class with all details provided", async () => {
			const response = await request(app)
				.post("/class")
				.set("Authorization", `Bearer ${token}`) // set the JWT as an Authorization header
				.send({
					title: "Test Class",
					description: "This is a test class",
					startTime: "2023-11-11T08:00:00Z",
					endTime: "2023-11-11T09:00:00Z",
					trainer: "Test Trainer",
				});

			expect(response.status).toBe(201);
			expect(response.body.message).toBe("Class successfully created");
			expect(response.body.class.title).toBe("Test Class");
		});

		it("should return error if end time is before start time", async () => {
			const response = await request(app)
				.post("/class")
				.set("Authorization", `Bearer ${token}`)
				.send({
					title: "Test Class",
					description: "This is a test class",
					startTime: "2023-08-11T09:00:00Z",
					endTime: "2023-08-11T08:00:00Z",
					trainer: "Test Trainer",
				});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("endTime must be after startTime.");
		});

		it("should return error if class time overlaps with an existing class", async () => {
			const response = await request(app)
				.post("/class")
				.set("Authorization", `Bearer ${token}`)
				.send({
					title: "Test Overlapping Class",
					description: "This class is for testing overlaps",
					startTime: "2023-08-10T10:30:00Z",
					endTime: "2023-08-10T11:30:00Z",
					trainer: "Overlap Trainer",
				});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe(
				"Class time overlaps with an existing class."
			);
		});

		// Cleanup: delete the test classes created for createClass tests
		afterAll(async () => {
			await Class.deleteMany({ trainer: "Test Trainer" });
			await Class.deleteMany({ trainer: "Overlap Trainer" });
		});
	});

	describe("updateClassDetails functionality", () => {
		let token;
		let createdClass;

		// Setup: Login as an admin user
		beforeAll(async () => {
			const credentials = {
				email: "admin1@admin.com",
				password: process.env.ADMIN_PASSWORD,
			};
			const loginresponse = await request(app)
				.post("/user/login")
				.send(credentials);
			token = loginresponse.body.token;

			// Create a sample class for testing
			createdClass = await Class.create({
				title: "Test Class",
				description: "Class for testing updates",
				startTime: new Date("2023-08-11T10:00:00Z"),
				endTime: new Date("2023-08-11T11:00:00Z"),
				trainer: "Test Trainer",
			});
		});

		it("should update class details with provided data", async () => {
			const response = await request(app)
				.put(`/class/update/${createdClass._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send({
					title: "Updated Test Class",
					description: "Updated class description",
				});

			expect(response.status).toBe(200);
			expect(response.body.message).toBe("Class successfully updated!");
			expect(response.body.class.title).toBe("Updated Test Class");
		});

		// Cleanup: delete the test classes created for updateClassDetails tests
		afterAll(async () => {
			await Class.deleteOne({ _id: createdClass._id });
		});
	});

	describe('classSignup functionality', () => {
		let token;
		let createdClass;
		let userId;
	
		beforeAll(async () => {
			const credentials = {
				email: "test3@email.com",
				password: "testtest", 
			};
	
			const loginresponse = await request(app).post("/user/login").send(credentials);
			token = loginresponse.body.token;
			userId = loginresponse.body.user.id; 
	
			// Create a sample class for testing
			createdClass = await Class.create({
				title: "Class for Signup Test",
				description: "This class will be used to test class signup",
				startTime: new Date('2023-08-16T10:00:00Z'),
				endTime: new Date('2023-08-16T11:00:00Z'),
				trainer: "Test Trainer"
			});
		});
	
		it('should allow a user to sign up for a class and update both user and class records', async () => {
			const response = await request(app)
				.put(`/class/${createdClass._id}`)  
				.set("Authorization", `Bearer ${token}`);
	
			expect(response.status).toBe(200);
			expect(response.body.message).toBe("Class saved to user profile successfully. Class participant list also updated.");
	
			
			// Check if the class is added to the user's saved classes
			const userAfterSignup = await User.findById(userId);
			expect(userAfterSignup.savedClasses).toContainEqual(createdClass._id);
	
			// Check if the user is added to the class's participant list
			const classAfterSignup = await Class.findById(createdClass._id);
			expect(classAfterSignup.participantList.map(id => id.toString())).toContain(userId);
		});
	});
	

	describe("deleteClass functionality", () => {
		let token;
		let createdClass;

		// Setup: Login as an admin user
		beforeAll(async () => {
			const credentials = {
				email: "admin1@admin.com",
				password: process.env.ADMIN_PASSWORD,
			};
			const loginresponse = await request(app)
				.post("/user/login")
				.send(credentials);
			token = loginresponse.body.token;

			// Create a sample class for testing
			createdClass = await Class.create({
				title: "Class for Deletion Test",
				description: "This class will be deleted",
				startTime: new Date("2023-08-15T10:00:00Z"),
				endTime: new Date("2023-08-15T11:00:00Z"),
				trainer: "Test Trainer",
			});
		});

		it("should delete the class by its ID", async () => {
			const response = await request(app)
				.delete(`/class/${createdClass._id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toBe("Class deleted");

			// Optionally: check if the class is indeed removed from the database
			const checkClass = await Class.findById(createdClass._id);
			expect(checkClass).toBeNull();
		});
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});
});


