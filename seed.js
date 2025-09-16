const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/comingup', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create sample instructors
    const instructor1 = new User({ name: 'John Doe', email: 'john@example.com', role: 'instructor' });
    await instructor1.setPassword('password123');
    await instructor1.save();

    const instructor2 = new User({ name: 'Jane Smith', email: 'jane@example.com', role: 'instructor' });
    await instructor2.setPassword('password123');
    await instructor2.save();

    // Create sample courses
    const courses = [
      {
        title: 'Introduction to React',
        description: 'Learn the basics of React.js',
        price: 49.99,
        instructor: instructor1._id,
        category: 'Web Development',
        tags: ['React', 'JavaScript', 'Frontend'],
      },
      {
        title: 'Advanced Node.js',
        description: 'Master Node.js for backend development',
        price: 79.99,
        instructor: instructor2._id,
        category: 'Backend Development',
        tags: ['Node.js', 'JavaScript', 'Backend'],
      },
      {
        title: 'Data Science with Python',
        description: 'Explore data science concepts using Python',
        price: 99.99,
        instructor: instructor1._id,
        category: 'Data Science',
        tags: ['Python', 'Data Science', 'Machine Learning'],
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the principles of user interface and experience design',
        price: 59.99,
        instructor: instructor2._id,
        category: 'Design',
        tags: ['UI', 'UX', 'Design'],
      },
    ];

    await Course.insertMany(courses);
    console.log('Sample data seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
