import mongoose from 'mongoose';
import { connectDB, Issue } from './src/db-mongo.js';

async function check() {
  try {
    await connectDB();
    const issues = await Issue.find({});
    console.log('Issues in DB:');
    issues.forEach(i => console.log(`- ${i.title}`));
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    process.exit(0);
  }
}
check();
