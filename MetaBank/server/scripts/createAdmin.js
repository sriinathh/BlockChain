require('dotenv').config();
const mongoose = require('../config/db');
const User = require('../models/User');

async function run() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@metabank.local';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    user = new User({ username: 'admin', email, password, role: 'admin', fullName: 'Administrator' });
    await user.save();
    console.log('Admin user created:', email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
