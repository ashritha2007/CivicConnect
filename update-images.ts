import mongoose from 'mongoose';
import { connectDB, Issue } from './src/db-mongo.js';

const updates = [
  { match: /Garbage Accumulation/i, url: "https://static.toiimg.com/thumb/msid-63890683,width-1280,height-720,resizemode-72/63890683.jpg" },
  { match: /Stray Dog/i, url: "https://static.toiimg.com/thumb/msid-100866606,width-400,height-225,resizemode-72/100866606.jpg" },
  { match: /Potholes/i, url: "https://th-i.thgim.com/public/incoming/58dsup/article68597039.ece/alternates/FREE_1200/VSP03_BAD%20ROADS%201.JPG" },
  { match: /Water Pipeline|chemical leak/i, url: "https://indianinfrastructure.com/wp-content/uploads/2021/09/II-64-1.jpg" },
  { match: /Street/i, url: "https://assets.thehansindia.com/h-upload/2022/09/14/1312381-streetlights.webp" },
  { match: /Improper roads/i, url: "https://img.freepik.com/premium-photo/red-dust-mud-road-poor-condition-with-large-holes-bumps-formed-after-rain-routes-andringitra-national-park-are-extremely-bad-wet-season-region-near-sendrisoa-madagascar_692357-3239.jpg" },
  { match: /Roads are not safe|Excavation/i, url: "https://th-i.thgim.com/public/news/cities/Coimbatore/article19649306.ece/alternates/FREE_1200/SA09ROAD" },
];

async function update() {
  try {
    await connectDB();
    const issues = await Issue.find({});
    console.log("Database connected. Iterating issues...");
    for (let issue of issues) {
      let updated = false;
      // Reverse order so that specific "Improper roads" matches before "Potholes" if needed
      for (let i = updates.length - 1; i >= 0; i--) {
        const u = updates[i];
        if (issue.title && u.match.test(issue.title)) {
            console.log(`Matched: "${issue.title}" against /${u.match.source}/`);
            issue.photo_url = u.url;
            await issue.save();
            updated = true;
            break;
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

update();
