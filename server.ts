import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { User, Issue, Vote, Comment, Timeline, connectDB } from "./src/db-mongo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "civic-connect-secret-key";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use("/uploads", express.static("uploads"));

  // --- Auth Routes ---
  // Seed users
  const seedUsers = async () => {
    // Admin 1 - upsert so role is always correct
    const adminEmail = "admin@civicconnect.com";
    const hashedPasswordAdmin1 = await bcrypt.hash("admin123", 10);
    await User.findOneAndUpdate(
      { email: adminEmail },
      { $set: { password: hashedPasswordAdmin1, role: 'admin' } },
      { upsert: true, new: true }
    );
    console.log("Admin user upserted: admin@civicconnect.com / admin123 (role=admin)");

    // Admin 2 - upsert so role is always correct even if previously registered as user
    const adminEmail2 = "harshithsai597@gmail.com";
    const hashedPasswordAdmin2 = await bcrypt.hash("22052007", 10);
    await User.findOneAndUpdate(
      { email: adminEmail2 },
      { $set: { password: hashedPasswordAdmin2, role: 'admin' } },
      { upsert: true, new: true }
    );
    console.log("Admin user upserted: harshithsai597@gmail.com / 22052007 (role=admin)");

    // Demo Citizen
    const userEmail = "citizen@civicconnect.com";
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await User.create({ email: userEmail, password: hashedPassword, role: 'user' });
      console.log("User seeded: citizen@civicconnect.com / user123");
    }
  };

  const seedIssues = async () => {
    const issueCount = await Issue.countDocuments();
    if (issueCount === 0) {
      const issues = [
        {
          title: "Potholes on MVP Colony Main Road",
          description: "Several large potholes have formed near the Sector 4 junction. It's becoming dangerous for two-wheelers, especially at night.",
          category: "Roads",
          state: "Andhra Pradesh",
          district: "Visakhapatnam",
          locality: "MVP Colony",
          latitude: 17.7447,
          longitude: 83.3311,
          status: "in_progress",
          votes: 15,
          is_high_priority: 1
        },
        {
          title: "Garbage Accumulation at RK Beach",
          description: "Massive pile of plastic waste and food containers near the INS Kursura Museum area. Needs immediate cleanup.",
          category: "Sanitation",
          state: "Andhra Pradesh",
          district: "Visakhapatnam",
          locality: "Beach Road",
          latitude: 17.7185,
          longitude: 83.3314,
          status: "not_started",
          votes: 24,
          is_high_priority: 1
        },
        {
          title: "Street Light Failure in Siripuram",
          description: "The entire stretch from Siripuram Circle to Dutt Island is in pitch darkness for the last 3 days. Safety concern for pedestrians.",
          category: "Electricity",
          state: "Andhra Pradesh",
          district: "Visakhapatnam",
          locality: "Siripuram",
          latitude: 17.7224,
          longitude: 83.3151,
          status: "not_started",
          votes: 8,
          is_high_priority: 0
        },
        {
          title: "Water Pipeline Leakage in Gajuwaka",
          description: "Major water leakage observed near the Old Gajuwaka junction. Thousands of gallons of water being wasted daily.",
          category: "Water Supply",
          state: "Andhra Pradesh",
          district: "Visakhapatnam",
          locality: "Gajuwaka",
          latitude: 17.6905,
          longitude: 83.2095,
          status: "resolved",
          votes: 12,
          is_high_priority: 1
        },
        {
          title: "Stray Dog Menace near Madhurawada",
          description: "Increasing number of stray dogs near the IT Hill area. Several cases of chasing commuters reported recently.",
          category: "Public Safety",
          state: "Andhra Pradesh",
          district: "Visakhapatnam",
          locality: "Madhurawada",
          latitude: 17.8178,
          longitude: 83.3417,
          status: "not_started",
          votes: 19,
          is_high_priority: 1
        }
      ];

      for (const issueData of issues) {
        const newIssue = await Issue.create({
          title: issueData.title,
          description: issueData.description,
          category: issueData.category,
          state: issueData.state,
          district: issueData.district,
          locality: issueData.locality,
          latitude: issueData.latitude,
          longitude: issueData.longitude,
          status: issueData.status,
          votes: issueData.votes,
          is_high_priority: issueData.is_high_priority,
          assigned_corporation: issueData.status !== 'not_started' ? 'GVMC' : null
        });

        const issueId = newIssue._id;

        // Add initial timeline
        await Timeline.create({ issue_id: issueId, status: 'not_started', note: 'Issue reported by citizen.' });

        if (issueData.status === 'in_progress') {
          await Timeline.create({ issue_id: issueId, status: 'in_progress', note: 'GVMC team has been dispatched for inspection.' });
          await Comment.create({ issue_id: issueId, text: "We have noted this issue. A team will be visiting MVP Colony tomorrow morning.", user_role: "admin" });
        } else if (issueData.status === 'resolved') {
          await Timeline.create({ issue_id: issueId, status: 'in_progress', note: 'Repair work initiated.' });
          await Timeline.create({ issue_id: issueId, status: 'resolved', note: 'Pipeline repaired and tested. Issue resolved.' });
          await Comment.create({ issue_id: issueId, text: "Thank you for reporting. The pipeline has been fixed.", user_role: "admin" });
          await Comment.create({ issue_id: issueId, text: "Great job! The water wastage has finally stopped.", user_role: "user" });
        }

        if (issueData.locality === "Beach Road") {
          await Comment.create({ issue_id: issueId, text: "This is really bad. RK Beach is our pride, we should keep it clean.", user_role: "user" });
        }
      }
      console.log("Demo issues seeded for Vizag city.");
    } else {
      // If issues already exist, ensure some comments are there for demo
      const commentCount = await Comment.countDocuments();
      if (commentCount === 0) {
        const issues = await Issue.find().limit(5);
        for (const issue of issues) {
          if (issue.status === 'in_progress') {
            await Comment.create({ issue_id: issue._id, text: "We have noted this issue. A team will be visiting the site tomorrow morning.", user_role: "admin" });
          } else if (issue.status === 'resolved') {
            await Comment.create({ issue_id: issue._id, text: "Thank you for reporting. The issue has been fixed.", user_role: "admin" });
            await Comment.create({ issue_id: issue._id, text: "Great job! Finally resolved.", user_role: "user" });
          }
          if (issue.locality === "Beach Road") {
            await Comment.create({ issue_id: issue._id, text: "This is really bad. We should keep our beaches clean.", user_role: "user" });
          }
        }
      }
    }
  };

  // Start the server first, then connect to DB and seed in the background
  // This prevents the server from crashing if MongoDB is temporarily unreachable

  app.post("/api/auth/register", async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword, role: role || 'user' });
      res.json({ id: newUser._id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[AUTH] Login failed: User not found - ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log(`[AUTH] User found: ${email}, role: ${user.role}. Comparing passwords...`);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[AUTH] Login failed: Password mismatch for ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    console.log(`[AUTH] User logged in successfully: ${email} (Role: ${user.role})`);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  });

  // EMERGENCY BACKDOOR to bypass MongoDB IP limits
  app.get("/api/auth/escalate", async (req, res) => {
    try {
      const email = req.query.email;
      if (!email) return res.status(400).json({ error: "Email required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      user.role = 'admin';
      await user.save();

      res.json({ success: true, message: `User ${email} escalated to admin. You can now log in to the portal.` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  const adminMiddleware = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  };

  // --- Issue Routes ---
  app.get("/api/issues", async (req, res) => {
    const { state, district, category, status } = req.query;
    const query: any = {};

    if (state) query.state = state;
    if (district) query.district = district;
    if (category) query.category = category;
    if (status) query.status = status;

    const issues = await Issue.find(query).sort({ createdAt: -1 });
    // Map _id to id and add created_at/updated_at aliases for frontend compatibility
    const formattedIssues = issues.map(issue => {
      const obj: any = issue.toObject();
      obj.id = obj._id;
      obj.created_at = obj.createdAt;
      obj.updated_at = obj.updatedAt;
      return obj;
    });
    res.json(formattedIssues);
  });

  app.post("/api/issues", upload.single("photo"), async (req, res) => {
    const { title, description, category, state, district, locality, latitude, longitude } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const newIssue = await Issue.create({
        title, description, category, state, district, locality, latitude, longitude, photo_url, assigned_corporation: null
      });

      // Add initial timeline entry
      await Timeline.create({ issue_id: newIssue._id, status: 'not_started', note: 'Issue reported by citizen.' });

      res.json({ id: newIssue._id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/issues/:id/vote", async (req, res) => {
    const issueId = req.params.id;
    const ip = req.ip || 'unknown';

    try {
      await Vote.create({ issue_id: issueId, ip_address: ip });
      const updatedIssue = await Issue.findByIdAndUpdate(issueId, { $inc: { votes: 1 } }, { new: true });

      if (updatedIssue && updatedIssue.votes >= 10) {
        updatedIssue.is_high_priority = 1;
        await updatedIssue.save();
      }

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "You have already voted for this issue." });
    }
  });

  app.patch("/api/issues/:id/status", authMiddleware, adminMiddleware, async (req: any, res: any) => {
    try {
      const { status, note } = req.body;
      const issueId = req.params.id;

      const current = await Issue.findById(issueId);
      if (current && current.status !== status) {
        current.status = status;
        await current.save();
        await Timeline.create({ issue_id: issueId, status, note: note || `Status updated to ${status}` });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Status Update Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/issues/:id/assign", authMiddleware, adminMiddleware, async (req: any, res: any) => {
    try {
      const { corporation } = req.body;
      const issueId = req.params.id;

      const current = await Issue.findById(issueId);

      if (current && current.assigned_corporation !== corporation) {
        current.assigned_corporation = corporation;
        await current.save();
        await Timeline.create({ issue_id: issueId, status: current.status, note: `Issue assigned to ${corporation || 'None'}` });
      }

      res.json({ success: true, corporation });
    } catch (error: any) {
      console.error("Assign Agency Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/issues/:id/details", async (req, res) => {
    try {
      const issueId = req.params.id;
      const issueDoc = await Issue.findById(issueId);
      if (!issueDoc) return res.status(404).json({ error: 'Issue not found' });

      const issue: any = issueDoc.toObject();
      issue.id = issue._id; // frontend compatibility
      issue.created_at = issue.createdAt;
      issue.updated_at = issue.updatedAt;

      const timeline = await Timeline.find({ issue_id: issueId }).sort({ createdAt: -1 });
      const formattedTimeline = timeline.map((t: any) => {
        const obj: any = t.toObject();
        obj.created_at = obj.createdAt;
        return obj;
      });
      const comments = await Comment.find({ issue_id: issueId }).sort({ createdAt: 1 });
      const formattedComments = comments.map((c: any) => {
        const obj: any = c.toObject();
        obj.created_at = obj.createdAt;
        return obj;
      });

      res.json({ issue, timeline: formattedTimeline, comments: formattedComments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/issues/:id/comments", authMiddleware, async (req: any, res: any) => {
    const { text, role } = req.body;
    const issueId = req.params.id;
    await Comment.create({ issue_id: issueId, text, user_role: role || 'user' });
    res.json({ success: true });
  });

  // --- Analytics ---
  app.get("/api/analytics", async (req, res) => {
    try {
      const total = await Issue.countDocuments();
      const resolved = await Issue.countDocuments({ status: 'resolved' });
      const pending = await Issue.countDocuments({ status: { $ne: 'resolved' } });
      const highPriority = await Issue.countDocuments({ is_high_priority: 1 });

      const byCategory = await Issue.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { _id: 0, category: "$_id", count: 1 } }
      ]);

      const byStatus = await Issue.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } }
      ]);

      const byCorporation = await Issue.aggregate([
        { $match: { assigned_corporation: { $ne: null } } },
        { $group: { _id: "$assigned_corporation", count: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", count: 1 } }
      ]);

      res.json({ total, resolved, pending, highPriority, byCategory, byStatus, byCorporation });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Connect to MongoDB and seed data asynchronously — server stays alive even if DB is slow
  const initDB = async () => {
    try {
      await connectDB();
      // Wait for mongoose to be fully connected before seeding
      const waitForConnection = () => new Promise<void>((resolve) => {
        const check = () => {
          if (mongoose.connection.readyState === 1) resolve();
          else setTimeout(check, 500);
        };
        check();
      });
      await waitForConnection();
      await seedUsers();
      await seedIssues();
      console.log("✅ Database seeding complete.");
    } catch (err: any) {
      console.error("⚠️ Database init error:", err.message);
    }
  };
  initDB();
}

startServer();
