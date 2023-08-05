// To seed local database with users and classes, run npm run seed-test
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/user");
const Class = require("./models/class");
const moment = require("moment-timezone");
const bcrypt = require("bcrypt");

// MongoDB database URL
let databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
	case "production":
		databaseURL = process.env.DATABASE_URL;
		break;
	case "development":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db";
		break;
	case "test":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db_test";
		break;
	default:
		console.error("Wrong environment mode. Database cannot connect.");
}

// Connect to the database
async function seedDatabase() {
	try {
		await mongoose.connect(databaseURL);
		console.log("Connected to database!\n");

		// Check if WIPE=true environment variable is set to true
		const wipeData = process.env.WIPE === "true";

		if (wipeData) {
			// Delete all existing users and classes only when WIPE=true
			await User.deleteMany();
			await Class.deleteMany();
			console.log("Existing data deleted. \n");
		}

		// Check if SEED=true environment variable is set to true
		const seedData = process.env.SEED === "true";

		if (seedData) {
			// Call seeding function only when SEED=true
			await seedUsers();
			await seedClasses();
			await addSavedClassesToTestUser();
			await addParticipantListToClass();
			console.log("Database seeding completed.\n");
		}

		// Close the database connection
		await mongoose.connection.close();
		console.log("Database connection closed.");
		console.log();
	} catch (error) {
		console.error("Error seeding database:", error);
	}
}

// Call the seedDatabase function to start the seeding process
seedDatabase();

// Seeding function for users (with two admins)
async function seedUsers() {
	try {
		const saltRounds = 10;
		const users = [
			{
				email: "admin1@admin.com",
				password: await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds),
				firstName: "admin1",
				lastName: "Fitness",
				mobile: "1234567890",
				street: "123 Main St",
				suburb: "Sunnybank",
				state: "QLD",
				postcode: "0000",
				isAdmin: true,
				savedClasses: [],
			},
			{
				email: "admin2@admin.com",
				password: await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds),
				firstName: "admin2",
				lastName: "Fitness",
				mobile: "00000",
				street: "10 Admin St",
				suburb: "Sunnybank",
				state: "QLD",
				postcode: "0000",
				isAdmin: true,
				savedClasses: [],
			},
			{
				email: "test1@email.com",
				password: await bcrypt.hash("test123", saltRounds),
				firstName: "Test1",
				lastName: "User",
				mobile: "0451255620",
				street: "5 South St",
				suburb: "Sunnybank",
				state: "QLD",
				postcode: "5555",
				isAdmin: false,
				savedClasses: [],
			},
			{
				email: "test2@email.com",
				password: await bcrypt.hash("test123", saltRounds),
				firstName: "Sally",
				lastName: "Bob",
				mobile: "0404562185",
				street: "10 London St",
				suburb: "Sunnybank",
				state: "QLD",
				postcode: "4444",
				isAdmin: false,
				savedClasses: [],
			},
			{
				email: "test3@email.com",
				password: await bcrypt.hash("testtest", saltRounds),
				firstName: "Tom",
				lastName: "George",
				mobile: "0404526589",
				street: "1 Fake Street",
				suburb: "Sunnybank",
				state: "QLD",
				postcode: "3333",
				isAdmin: false,
				savedClasses: [],
			},
		];
		await User.insertMany(users);
		console.log("Users seeded successfully.");
	} catch (error) {
		console.error("Error seeding users:", error);
	}
}

// Seeding function for classes
async function seedClasses() {
	try {
		const trainerNames = [
			"John",
			"Mary",
			"David",
			"Sarah",
			"Michael",
			"Jessica",
			"Kevin",
			"Emily",
			"Brian",
			"Alex",
		];

		const classOptions = [
			{
				title: "Yoga Class",
				description: "A relaxing yoga class for all levels",
			},
			{
				title: "Pilates",
				description: "Pilates workout for core strength",
			},
			{
				title: "Zumba",
				description: "Dance your way to fitness with Zumba",
			},
			{
				title: "Cycling",
				description: "Group indoor cycling activity",
			},
			{
				title: "HIIT",
				description: "High-intensity interval training",
			},
			{
				title: "Body Pump",
				description: "Strength training with weights",
			},
			{
				title: "Kickboxing",
				description: "Kick and punch your way to fitness",
			},
			{
				title: "CrossFit",
				description: "High-intensity functional fitness",
			},
			{
				title: "Boot Camp",
				description: "Outdoor fitness training",
			},
			{
				title: "Spin Class",
				description: "Cardio workout on stationary bikes",
			},
		];

		const getRandomItem = (array) => {
			const randomIndex = Math.floor(Math.random() * array.length);
			return array[randomIndex];
		};

		const getRandomTrainerName = () => getRandomItem(trainerNames);

		const generateRandomClassData = () => {
			const startMonth = Math.floor(Math.random() * 3) + 7; // Random month between July and September (7 to 9)
			const startDay = Math.floor(Math.random() * 30) + 1; // Random day between 1 to 31
			const startHour = Math.floor(Math.random() * 12) + 7; // Random hour between 7am and 6pm

			const startDate = moment.tz(
				`2023-${startMonth.toString().padStart(2, "0")}-${startDay
					.toString()
					.padStart(2, "0")} ${startHour}:00`,
				"UTC"
			);
			const startTime = startDate.toISOString(); // Use standard ISO 8601 format
			const endTime = startDate.add(1, "hour").toISOString(); // Use standard ISO 8601 format

			const classOption = getRandomItem(classOptions);

			return {
				title: classOption.title,
				description: classOption.description,
				startTime,
				endTime,
				trainer: getRandomTrainerName(),
				participantList: [],
			};
		};

		const classData = [];
		for (let i = 0; i < 300; i++) {
			classData.push(generateRandomClassData());
		}
		await Class.insertMany(classData);
		console.log("Classes seeded successfully.");
	} catch (error) {
		console.error("Error seeding classes:", error);
	}
}

// Add savedClasses to a test user
async function addSavedClassesToTestUser() {
	try {
		const yogaClass = await Class.findOne({ title: "Yoga Class" });
		const zumbaClass = await Class.findOne({ title: "Zumba" });
		const user1 = await User.findOne({ email: "test1@email.com" });
		const user2 = await User.findOne({ email: "test2@email.com" });

		user1.savedClasses.push(yogaClass._id, zumbaClass._id);
		user2.savedClasses.push(yogaClass._id);

		await Promise.all([user1.save(), user2.save()]);

		console.log("Saved classes added to test users successfully.");
	} catch (error) {
		console.error("Error adding saved classes to test users:", error);
	}
}

// Add participantList to classes
async function addParticipantListToClass() {
	try {
		const yogaClass = await Class.findOne({ title: "Yoga Class" });
		const zumbaClass = await Class.findOne({ title: "Zumba" });
		const user1 = await User.findOne({ email: "test1@email.com" });
		const user2 = await User.findOne({ email: "test2@email.com" });

		yogaClass.participantList.push(user1._id, user2._id);
		zumbaClass.participantList.push(user1._id);

		await Promise.all([yogaClass.save(), zumbaClass.save()]);

		console.log("Participant list updated for classes successfully.");
	} catch (error) {
		console.error("Error updating participant list for classes:", error);
	}
}
