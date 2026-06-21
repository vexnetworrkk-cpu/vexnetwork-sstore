require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('./models/AdminUser');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/VexNetwork');
    console.log('Connected to MongoDB');

    const email = process.argv[2];
    const password = process.argv[3];
    const role = process.argv[4] || 'owner'; // default to owner if not provided

    if (!email || !password) {
      console.log('Usage: node seedAdmin.js <email> <password> [role]');
      process.exit(1);
    }

    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user with this email already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new AdminUser({
      email,
      password: hashedPassword,
      role
    });

    await admin.save();
    console.log(`Successfully created admin user: ${email} with role: ${role}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
