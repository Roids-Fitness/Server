// To seed database with users and classes, run npm run seed

const mongoose = require('mongoose');
const User = require('./models/user'); 
const Class = require('./models/class'); 

// MongoDB database URL
const databaseURL = "mongodb://localhost:27017/roids_fitness_db";

// Connect to the database
mongoose.connect(databaseURL)
  .then(() => {
    console.log("Connected to database!");
    // Call seeding functions
    seedUsers();
    seedClasses();
  })
  .catch((error) => {
    console.error("Could not connect to database:\n", error);
  });

// Seeding function for users (with two admins)
async function seedUsers() {
  try {
    const users = [
      {
        email: 'admin1@admin.com',
        password: 'admin1',
        firstName: 'admin1',
        lastName: 'Fitness',
        mobile: '1234567890',
        street: '123 Main St',
        suburb: 'Sunnybank',
        state: 'QLD',
        postcode: '0000',
        isAdmin: true,
        savedClasses: [],
      },
	  {
        email: 'admin2@admin.com',
        password: 'admin2',
        firstName: 'admin2',
        lastName: 'Fitness',
        mobile: '00000',
        street: '10 Admin St',
        suburb: 'Sunnybank',
        state: 'QLD',
        postcode: '0000',
        isAdmin: true,
        savedClasses: [],
      },
	  {
        email: 'test1@email.com',
        password: 'test123',
        firstName: 'Test1',
        lastName: 'User',
        mobile: '0451255620',
        street: '5 South St',
        suburb: 'Sunnybank',
        state: 'QLD',
        postcode: '5555',
        isAdmin: false,
        savedClasses: [],
      },
	  {
        email: 'test2@email.com',
        password: 'test123',
        firstName: 'Sally',
        lastName: 'Bob',
        mobile: '0404562185',
        street: '10 London St',
        suburb: 'Sunnybank',
        state: 'QLD',
        postcode: '4444',
        isAdmin: false,
        savedClasses: [],
      },
	  {
        email: 'test3@email.com',
        password: 'test000',
        firstName: 'Tom',
        lastName: 'George',
        mobile: '0404526589',
        street: '1 Fake Street',
        suburb: 'Sunnybank',
        state: 'QLD',
        postcode: '3333',
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
    const classes = [
      {
        title: 'Yoga Class',
        startTime: new Date(2023, 6, 16, 14, 0),
        endTime: new Date(2023, 6, 16, 15, 0),
        trainer: 'Alex',
        description: 'Very relaxing Yoga Class',
        participantList: [],
      },
	  {
        title: 'Abs Class',
        startTime: new Date(2023, 6, 17, 14, 0),
        endTime: new Date(2023, 6, 17, 16, 0),
        trainer: 'Alex',
        description: 'Core and Abs intense workout',
        participantList: [],
      },
	  {
        title: 'Pilates',
        startTime: new Date(2023, 6, 17, 8, 0),
        endTime: new Date(2023, 6, 17, 9, 0),
        trainer: 'Emma',
        description: 'In this class you will get your sweat on',
        participantList: [],
      },
	  {
        title: 'Cycling',
        startTime: new Date(2023, 6, 18, 10, 0),
        endTime: new Date(2023, 6, 18, 12, 0),
        trainer: 'Emma',
        description: 'Group Indoor Bike activity',
        participantList: [],
      },
	  {
        title: 'HIIT',
        startTime: new Date(2023, 6, 18, 15, 0),
        endTime: new Date(2023, 6, 18, 16, 0),
        trainer: 'Zoe',
        description: 'High intensity cardio class',
        participantList: [],
      },
    ];
    await Class.insertMany(classes);
    console.log("Classes seeded successfully.");
  } catch (error) {
    console.error("Error seeding classes:", error);
  }
}
