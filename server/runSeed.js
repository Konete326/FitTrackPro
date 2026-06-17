require('dotenv').config();
const connectDB = require('./Database/db');
const seedAdmin = require('./Database/seedAdmin');

(async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Running admin seed...');
  await seedAdmin();
  console.log('Done. Exiting.');
  process.exit(0);
})();
