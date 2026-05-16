const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bcrypt = require('bcrypt');
const JobRequest = require('./models/JobRequest');
const User = require('./models/User');

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL || 'admin@proconnect.test';
const adminPassword = process.env.ADMIN_PASSWORD || 'Password123';
const adminName = process.env.ADMIN_NAME || 'ProConnect Admin';

const sampleJobs = [
  {
    title: 'Leaking kitchen tap repair',
    description: 'Kitchen tap has been dripping constantly for the past week. Need urgent repair to prevent water waste.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Jane McCall',
    contactEmail: 'jane.mccall@email.com',
  },
  {
    title: 'Rewire bedroom electrical sockets',
    description: 'Need to rewire 4 electrical sockets in the main bedroom. Some outlets are not working properly.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'John Campbell',
    contactEmail: 'j.campbell@email.com',
  },
  {
    title: 'Paint living room walls',
    description: 'Looking for a painter to repaint the living room walls. Room is approximately 4m x 5m. Paint already purchased.',
    category: 'Painting',
    location: 'Glasgow',
    contactName: 'Lisa Anderson',
    contactEmail: 'lisa.a@email.com',
  },
  {
    title: 'Custom kitchen cabinet installation',
    description: 'Need a joiner to install custom-made kitchen cabinets. Cabinets are ready, just need secure installation.',
    category: 'Joinery',
    location: 'Aberdeen',
    contactName: 'Michael Kerr',
    contactEmail: 'michael.kerr@email.com',
  },
  {
    title: 'Fix broken boiler',
    description: 'Central heating boiler stopped working yesterday. House is getting cold, need urgent service.',
    category: 'Plumbing',
    location: 'Dundee',
    contactName: 'Sarah McIntyre',
    contactEmail: 'sarah.mcintyre@email.com',
    status: 'Closed',
  },
];

const seed = async () => {
  try {
    await connectDB();
    await JobRequest.deleteMany();
    await JobRequest.create(sampleJobs);

    const normalizedEmail = adminEmail.toLowerCase().trim();
    const existingAdmin = await User.findOne({ email: normalizedEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: adminName,
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
      });
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
