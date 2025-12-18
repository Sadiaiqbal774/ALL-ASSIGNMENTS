// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beCleanerDB';

mongoose.connect(MONGODB_URI)
  .then(() => seed())
  .catch(err => { console.error(err); process.exit(1); });

async function seed(){
  try {
    await Product.deleteMany({});
    const sample = [
      { name: 'Standard Home Cleaning', price: 50, category: 'cleaning', image: '', description: 'Routine home cleaning (2 rooms).' },
      { name: 'Deep Cleaning', price: 120, category: 'cleaning', image: '', description: 'Deep cleaning (whole house).' },
      { name: 'Office Cleaning - Small', price: 80, category: 'office', image: '', description: 'Office cleaning up to 5 desks.' },
      { name: 'Vacuum Service', price: 30, category: 'service', image: '', description: 'Vacuum carpets and rugs.' },
      { name: 'Disinfection', price: 45, category: 'service', image: '', description: 'Surface disinfection and sanitization.' },
      { name: 'Window Cleaning', price: 35, category: 'service', image: '', description: 'Interior & exterior window cleaning.' }
    ];
    await Product.insertMany(sample);
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
}
