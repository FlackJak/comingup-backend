const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Course = require('./models/Course');
const Review = require('./models/Review');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const resolvers = {
  Query: {
    courses: async () => {
      return await Course.find().populate('instructor').populate('reviews');
    },
    course: async (_, { id }) => {
      return await Course.findById(id).populate('instructor').populate('reviews');
    },
    me: async (_, __, { req }) => {
      // Assume auth middleware sets user
      return req.user;
    },
    users: async (_, __, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      return await User.find();
    },
    user: async (_, { id }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      return await User.findById(id);
    },
    myCourses: async (_, __, { req }) => {
      if (!req.user || req.user.role !== 'instructor') {
        throw new Error('Unauthorized');
      }
      return await Course.find({ instructor: req.user.id }).populate('instructor').populate('reviews');
    },
  },
  Mutation: {
    signup: async (_, { name, email, password }) => {
      const user = new User({ name, email });
      await user.setPassword(password);
      await user.save();
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.validatePassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },

    createCourse: async (_, { title, description, price, category, tags }, { req }) => {
      if (!req.user || req.user.role !== 'instructor') {
        throw new Error('Unauthorized');
      }
      const course = new Course({ title, description, price, category, tags, instructor: req.user.id });
      await course.save();
      return course.populate('instructor');
    },

    updateCourse: async (_, { id, title, description, price, category, tags }, { req }) => {
      if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
        throw new Error('Unauthorized');
      }
      const course = await Course.findById(id);
      if (!course) {
        throw new Error('Course not found');
      }
      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user.id) {
        throw new Error('Unauthorized');
      }
      if (title !== undefined) course.title = title;
      if (description !== undefined) course.description = description;
      if (price !== undefined) course.price = price;
      if (category !== undefined) course.category = category;
      if (tags !== undefined) course.tags = tags;
      await course.save();
      return course.populate('instructor');
    },

    deleteCourse: async (_, { id }, { req }) => {
      if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
        throw new Error('Unauthorized');
      }
      const course = await Course.findById(id);
      if (!course) {
        throw new Error('Course not found');
      }
      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user.id) {
        throw new Error('Unauthorized');
      }
      await course.remove();
      return true;
    },

    enroll: async (_, { courseId }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const user = await User.findById(req.user.id);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }
      return 'Enrolled successfully';
    },

    addReview: async (_, { courseId, rating, comment }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      const review = new Review({
        user: req.user.id,
        course: courseId,
        rating,
        comment,
      });
      await review.save();
      course.reviews.push(review);
      await course.save();
      return review.populate('user').populate('course');
    },

    updateReview: async (_, { id, rating, comment }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const review = await Review.findById(id);
      if (!review) {
        throw new Error('Review not found');
      }
      if (review.user.toString() !== req.user.id) {
        throw new Error('Unauthorized');
      }
      if (rating !== undefined) review.rating = rating;
      if (comment !== undefined) review.comment = comment;
      await review.save();
      return review.populate('user').populate('course');
    },

    deleteReview: async (_, { id }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const review = await Review.findById(id);
      if (!review) {
        throw new Error('Review not found');
      }
      if (review.user.toString() !== req.user.id) {
        throw new Error('Unauthorized');
      }
      await review.remove();
      return true;
    },

    addToWishlist: async (_, { courseId }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const user = await User.findById(req.user.id);
      if (!user.wishlist.includes(courseId)) {
        user.wishlist.push(courseId);
        await user.save();
      }
      return true;
    },

    removeFromWishlist: async (_, { courseId }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const user = await User.findById(req.user.id);
      user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
      await user.save();
      return true;
    },

    createUser: async (_, { name, email, password, role }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const user = new User({ name, email, role });
      await user.setPassword(password);
      await user.save();
      return user;
    },

    updateUser: async (_, { id, name, email, role }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (role !== undefined) user.role = role;
      await user.save();
      return user;
    },

    deleteUser: async (_, { id }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      await user.remove();
      return true;
    },

    processPayment: async (_, { courseId, paymentMethod }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      // Mock payment processing logic
      return `Payment processed for course ${courseId} using ${paymentMethod}`;
    },

    sendNotification: async (_, { userId, message }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      // Mock notification sending logic
      console.log(`Notification to user ${userId}: ${message}`);
      return true;
    },
  },
  Course: {
    reviews: async (course) => {
      return await Review.find({ course: course.id }).populate('user');
    },
  },
  Review: {
    user: async (review) => {
      return await User.findById(review.user);
    },
  },
  User: {
    enrolledCourses: async (user) => {
      return await Course.find({ _id: { $in: user.enrolledCourses } }).populate('instructor');
    },
    wishlist: async (user) => {
      return await Course.find({ _id: { $in: user.wishlist } }).populate('instructor');
    },
  },
};

module.exports = resolvers;
