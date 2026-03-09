import express from "express";
import { User, Issue, Vote, Comment, Timeline, connectDB } from "../src/db-mongo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "civic-connect-secret-key";

// Use memory storage for uploads on Vercel (no persistent disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(express.json({ limit: '10mb' }));

// ─── UTILS ──────────────────────────────────────────────────────────────---
const seedUsers = async (forceReset = false) => {
    const adminEmail = "admin@civicconnect.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin || forceReset) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
        } else {
            await User.create({ email: adminEmail, password: hashedPassword, role: 'admin' });
        }
    }

    const userEmail = "citizen@civicconnect.com";
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash("user123", 10);
        await User.create({ email: userEmail, password: hashedPassword, role: 'user' });
    }
};

// ─── ROUTES ─────────────────────────────────────────────────────────────---
// Vercel can pass /api/xxx or /xxx depending on rewrites. 
// We'll use a router or regex to match both for critical routes.

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.get("/admin/emergency-reset", async (req, res) => {
    try {
        await connectDB();
        await seedUsers(true);
        res.json({ success: true, message: "Admin reset to 'admin123'" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/auth/register", async (req, res) => {
    try {
        await connectDB();
        const email = req.body.email.toLowerCase().trim();
        const { password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, role: role || 'user' });
        res.json({ id: newUser._id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        await connectDB();
        await seedUsers();
        const email = req.body.email.toLowerCase().trim();
        const { password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/issues", async (req, res) => {
    await connectDB();
    const { state, district, category, status } = req.query;
    const query: any = {};
    if (state) query.state = state;
    if (district) query.district = district;
    if (category) query.category = category;
    if (status) query.status = status;

    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.json(issues.map(i => ({ ...i.toObject(), id: i._id, created_at: (i as any).createdAt })));
});

router.post("/issues", upload.single("photo"), async (req, res) => {
    await connectDB();
    const { title, description, category, state, district, locality, latitude, longitude } = req.body;
    const photo_url = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    try {
        const newIssue = await Issue.create({ title, description, category, state, district, locality, latitude, longitude, photo_url });
        await Timeline.create({ issue_id: newIssue._id, status: 'not_started', note: 'Issue reported.' });
        res.json({ id: newIssue._id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/issues/:id/vote", async (req, res) => {
    await connectDB();
    try {
        await Vote.create({ issue_id: req.params.id, ip_address: req.ip || '0.0.0.0' });
        await Issue.findByIdAndUpdate(req.params.id, { $inc: { votes: 1 } });
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: "Already voted" });
    }
});

router.get("/issues/:id/details", async (req, res) => {
    await connectDB();
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Not found' });
    const timeline = await Timeline.find({ issue_id: req.params.id }).sort({ createdAt: -1 });
    const comments = await Comment.find({ issue_id: req.params.id }).sort({ createdAt: 1 });
    res.json({
        issue: { ...issue.toObject(), id: issue._id, created_at: (issue as any).createdAt },
        timeline: timeline.map(t => ({ ...t.toObject(), created_at: (t as any).createdAt })),
        comments: comments.map(c => ({ ...c.toObject(), created_at: (c as any).createdAt }))
    });
});

router.patch("/issues/:id/status", async (req, res) => {
    await connectDB();
    const { status, note } = req.body;
    await Issue.findByIdAndUpdate(req.params.id, { status });
    await Timeline.create({ issue_id: req.params.id, status, note: note || `Updated to ${status}` });
    res.json({ success: true });
});

router.patch("/issues/:id/assign", async (req, res) => {
    await connectDB();
    const { corporation } = req.body;
    await Issue.findByIdAndUpdate(req.params.id, { assigned_corporation: corporation });
    await Timeline.create({ issue_id: req.params.id, status: 'assigned', note: `Assigned to ${corporation}` });
    res.json({ success: true });
});

router.post("/issues/:id/comments", async (req, res) => {
    await connectDB();
    await Comment.create({ issue_id: req.params.id, text: req.body.text, user_role: req.body.role || 'user' });
    res.json({ success: true });
});

router.get("/analytics", async (req, res) => {
    await connectDB();
    const total = await Issue.countDocuments();
    const resolved = await Issue.countDocuments({ status: 'resolved' });
    const pending = await Issue.countDocuments({ status: { $ne: 'resolved' } });
    const highPriority = await Issue.countDocuments({ votes: { $gte: 10 } });
    res.json({ total, resolved, pending, highPriority });
});

// Mount the router at both /api and / to handle Vercel's rewrite quirks
app.use("/api", router);
app.use("/", router);

export default app;
