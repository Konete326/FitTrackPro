require('dotenv').config();
const connectDB = require('./Database/db');
const User = require('./Models/User_Model');

(async () => {
  await connectDB();
  const admins = await User.find({ Role: 'Admin' }).select('-Password');
  console.log('Admin users in DB:');
  console.log(JSON.stringify(admins, null, 2));
  process.exit(0);
})();
