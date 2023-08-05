// const request = require("supertest");
// const { app } = require("../server");
// const jwt = require('jsonwebtoken');
// const moment = require('moment-timezone');
// const Class = require('../models/class');
// jest.mock('jsonwebtoken');
// jest.mock('../models/class');
// const {
// 	createClass,
// 	getClassByID,
// 	updateClassDetails,
// 	deleteClass,
// 	classSignup,
// 	getAllClasses,
// } = require("../controllers/classes_controller");
// const {
// 	validateRequest,
// 	validateAdmin,
// } = require("../middlewares/auth_middleware");



// describe("Has a homepage...", () => {
// 	it("...it responds with status 200.", async () => {
// 		const response = await request(app).get("/");
// 		expect(response.statusCode).toEqual(200);
// 	});

// 	it("...it responds wtih a JSON object", async () => {
// 		const response = await request(app).get("/");
// 		const responseBodyDataType = typeof response.body;

// 		expect(responseBodyDataType).toEqual("object");
// 	});
// });

// describe("Classes...", () => {
// 	describe("...can be added...", () => {
// 		it("should successfully add a class", async () => {
// 			const newClass = {
// 				title: "Yoga",
// 				startTime: "2023-08-10T08:30:00",
// 				endTime: "2023-08-10T09:30:00",
// 				trainer: "John Doe",
// 				description: "A relaxing yoga class.",
// 			};
// 			const response = await request(app).post("/class").send(newClass);
// 			expect(response.status).toBe(201);
// 			expect(response.body.message).toBe("Class successfully created");
// 		});

// 		it("...should not be added when there are missing parameters...", async () => {
// 			const incompleteClass = {
// 				startTime: "2023-08-10T08:30:00",
// 				endTime: "2023-08-10T09:30:00",
// 				trainer: "John Doe",
// 			};
// 			const response = await request(app).post("/class").send(incompleteClass);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe("Missing required fields: title, startTime, endTime.");
// 		});

// 		it("...should not be added with conflicting times...", async () => {
// 			// Assuming a class at this time already exists in your test database setup
// 			const conflictingClass = {
// 				title: "Pilates",
// 				startTime: "2023-08-10T08:30:00",
// 				endTime: "2023-08-10T09:30:00",
// 				trainer: "Jane Smith",
// 				description: "A pilates class.",
// 			};
// 			const response = await request(app).post("/class").send(conflictingClass);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe("Class time overlaps with an existing class.");
// 		});

// 		it("...should not be added with an endTime occurring before startTime...", async () => {
// 			const invalidClass = {
// 				title: "Zumba",
// 				startTime: "2023-08-10T09:30:00",
// 				endTime: "2023-08-10T08:30:00",
// 				trainer: "Lucy Loo",
// 				description: "A Zumba class.",
// 			};
// 			const response = await request(app).post("/class").send(invalidClass);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe("endTime must be after startTime.");
// 		});

// 		it("...should not be added with an invalid date format...", async () => {
// 			const invalidDateFormatClass = {
// 				title: "Spin",
// 				startTime: "10th August 2023 08:30",
// 				endTime: "10th August 2023 09:30",
// 				trainer: "Tom Thumb",
// 				description: "A spinning class.",
// 			};
// 			const response = await request(app).post("/class").send(invalidDateFormatClass);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toContain("Invalid date format.");
// 		});
// 	});

// 	describe("...can be retrieved...", () => {
// 		it("should retrieve all classes", async () => {
// 			const response = await request(app).get("/class");
// 			expect(response.status).toBe(200);
// 			expect(Array.isArray(response.body)).toBe(true);
// 		});

// 		it("should retrieve a specific class by ID", async () => {
//             const classId = 'someValidClassId';  // Assuming you have a way to get this ID
//             const response = await request(app).get(`/class/${classId}`);
//             expect(response.status).toBe(200);
//             expect(response.body._id).toBe(classId);
//             expect(response.body.title).toBeDefined();
//         });
//     });

//     describe("...can be updated...", () => {
//         it("should successfully update class details", async () => {
//             const classId = 'someValidClassId'; // Assuming you have a way to get this ID
//             const updatedData = {
//                 title: "Advanced Yoga"
//             };
//             const response = await request(app).put(`/class/update/${classId}`).send(updatedData);
//             expect(response.status).toBe(200);
//             expect(response.body.title).toBe(updatedData.title);
//         });
//     });

//     describe("...user can sign up...", () => {
//         it("should allow user to sign up for a class", async () => {
//             const classId = 'someValidClassId'; // Assuming you have a way to get this ID
//             const userData = {
//                 userId: 'someValidUserId'  // Assuming you have a way to get this ID
//             };
//             const response = await request(app).put(`/class/${classId}`).send(userData);
//             expect(response.status).toBe(200);
//             expect(response.body.participantList).toContain(userData.userId);
//         });
//     });

//     describe("...can be deleted...", () => {
//         it("should delete a class by ID", async () => {
//             const classId = 'someValidClassId';  // Assuming you have a way to get this ID
//             const response = await request(app).delete(`/class/${classId}`);
//             expect(response.status).toBe(200);
//             expect(response.body.message).toBe("Class successfully deleted");
//         });
//     });

// 	describe("...filtering by trainer...", () => {
// 		it("should filter classes by a specified trainer", async () => {
// 			const response = await request(app).get("/class?trainer=John Doe");
// 			expect(response.status).toBe(200);
// 			expect(response.body.every(cls => cls.trainer === "John Doe")).toBe(true);
// 		});
// 	});
	
// 	describe("...fetching by ID...", () => {
// 		it("should return a 404 for a non-existent class ID", async () => {
// 			const response = await request(app).get("/class/invalidClassId");
// 			expect(response.status).toBe(404);
// 			expect(response.body.error).toBe("Class ID not found");
// 		});
// 	});
	
// 	describe("...creating a class...", () => {
// 		it("should not add a class without a request body", async () => {
// 			const response = await request(app).post("/class").send();
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe("Request body is missing");
// 		});
// 	});
	
// 	describe("...updating class details...", () => {
// 		it("should successfully update only startTime of class", async () => {
// 			const classId = 'someValidClassId'; 
// 			const updatedStartTime = "2023-08-11T08:30:00";
// 			const response = await request(app).put(`/class/update/${classId}`).send({startTime: updatedStartTime});
// 			expect(response.status).toBe(200);
// 			expect(response.body.startTime).toBe(updatedStartTime);
// 		});
// 	});
	
// 	describe("...signing up for a class...", () => {
// 		it("should not allow a user to sign up multiple times for the same class", async () => {
// 			const classId = 'someValidClassId';
// 			const userData = { userId: 'someValidUserId' };
// 			await request(app).put(`/class/${classId}`).send(userData);  // First signup
// 			const response = await request(app).put(`/class/${classId}`).send(userData);  // Second signup
// 			expect(response.status).toBe(200);
// 			const participants = new Set(response.body.participantList);
// 			expect(participants.has(userData.userId)).toBe(true);
// 			expect(participants.size).toBe(response.body.participantList.length);  // Ensure no duplicate userIds
// 		});
// 	});
	
// 	describe("...deleting a class...", () => {
// 		it("should remove the class from users' saved lists upon deletion", async () => {
// 			const classId = 'someValidClassId';
// 			const userId = 'someValidUserId';
// 			await request(app).delete(`/class/${classId}`);
// 			const user = await User.findById(userId);
// 			expect(user.savedClasses.includes(classId)).toBe(false);
// 		});
// 	});

// 	describe("...authorization...", () => {
// 		it("should not allow unauthorized user to create a class", async () => {
// 			const newClass = {
// 				title: "Yoga",
// 				startTime: "2023-08-10T08:30:00",
// 				endTime: "2023-08-10T09:30:00",
// 				trainer: "John Doe",
// 				description: "A relaxing yoga class.",
// 			};
// 			const response = await request(app).post("/class").send(newClass);
// 			expect(response.status).toBe(401);  // 401 is for Unauthorized
// 			expect(response.body.error).toBe("Unauthorized");
// 		});
	
// 	});
	

// });

