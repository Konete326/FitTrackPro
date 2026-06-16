const User = require('../Models/User_Model');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ Role: 'Admin' });

    if (adminExists) {
      console.log('Admin user already exists, skipping seed.');
      return;
    }

    const admin = await User.create({
      Username: process.env.ADMIN_USERNAME || 'admin',
      Email: process.env.ADMIN_EMAIL || 'admin@fittrackpro.com',
      Password: process.env.ADMIN_PASSWORD || 'Admin@123',
      Role: 'Admin',
      IsVerified: true,
      IsActive: true,
      Profile: {
        Name: 'Super Admin',
      },
    });

    console.log(`Admin user seeded: ${admin.Email}`);
  } catch (error) {
    console.error(`Admin seed error: ${error.message}`);
  }
};

module.exports = seedAdmin;
