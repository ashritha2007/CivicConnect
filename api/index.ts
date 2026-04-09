import express from "express";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "civic-connect-secret-key";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not set. Please add it in Vercel Project Settings → Environment Variables.");
}

// ─── Canonical Category-to-Corporation Mapping ────────────────────────────────
const CORP_CATEGORY_MAP: Record<string, string[]> = {
  GVMC:   ['Sanitation', 'Water Supply', 'Garbage'],
  VMRDA:  ['Roads', 'Infrastructure', 'Pothole'],
  EDPCL:  ['Electricity', 'Electrical'],
  POLICE: ['Public Safety'],
};

const buildCorpFilter = (corp: string): any => {
  const cats = CORP_CATEGORY_MAP[corp] || [];
  return {
    $or: [
      { assigned_corporation: corp },
      { category: { $in: cats } },
    ],
  };
};


// ─── DB MODELS (Inlined for Vercel Stability) ──────────────────────────────
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    reputation: { type: Number, default: 0 },
}, { timestamps: true });

const IssueSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    locality: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    photo_url: { type: String, default: null },
    status: { type: String, default: 'not_started' },
    assigned_corporation: { type: String, default: null },
    votes: { type: Number, default: 0 },
    is_high_priority: { type: Number, default: 0 },
}, { timestamps: true });

const VoteSchema = new Schema({
    issue_id: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    ip_address: { type: String, required: true },
}, { timestamps: true });
VoteSchema.index({ issue_id: 1, ip_address: 1 }, { unique: true });

const CommentSchema = new Schema({
    issue_id: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    text: { type: String, required: true },
    user_role: { type: String, required: true },
}, { timestamps: true });

const TimelineSchema = new Schema({
    issue_id: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    status: { type: String, required: true },
    note: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Issue = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
const Vote = mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
const Timeline = mongoose.models.Timeline || mongoose.model('Timeline', TimelineSchema);

// ─── HELPERS ──────────────────────────────────────────────────────────────
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    if (!MONGODB_URI) {
        throw new Error(
            'MONGODB_URI is not configured.'
        );
    }
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
};

// Helper: resolve corporation for a given category
const assignCorporation = (categoryName: string): string => {
  for (const [corp, cats] of Object.entries(CORP_CATEGORY_MAP)) {
    if (cats.includes(categoryName)) return corp;
  }
  return 'GVMC'; // fallback
};

const seedUsers = async (forceReset = false) => {
    // Admin 1
    const adminEmail = "admin@civicconnect.com";
    const hashedPasswordAdmin1 = await bcrypt.hash("admin123", 10);
    await User.findOneAndUpdate(
      { email: adminEmail },
      { $set: { password: hashedPasswordAdmin1, role: 'admin' } },
      { upsert: true, new: true }
    );

    // Admin 2
    const adminEmail2 = "harshithsai597@gmail.com";
    const hashedPasswordAdmin2 = await bcrypt.hash("22052007", 10);
    await User.findOneAndUpdate(
      { email: adminEmail2 },
      { $set: { password: hashedPasswordAdmin2, role: 'admin' } },
      { upsert: true, new: true }
    );

    // Demo Citizen
    const userEmail = "citizen@civicconnect.com";
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await User.create({ email: userEmail, password: hashedPassword, role: 'user' });
    }
};

const seedIssues = async () => {
    const issueCount = await Issue.countDocuments();
    if (issueCount === 0) {
      const issues = [
        {
          title: "CRITICAL: Flyover Structural Cracks noticed near MVP Colony",
          description: "Major hairline cracks extending through the main support pillar. Immediate inspection required to prevent structural failure.",
          category: "Infrastructure", state: "Andhra Pradesh", district: "Visakhapatnam", locality: "MVP Colony",
          latitude: 17.7447, longitude: 83.3311, status: "not_started", votes: 154, is_high_priority: 1
        },
        {
          title: "Emergency: Toxic Chemical Leak in Gajuwaka Drainage Channel",
          description: "Pungent smell and discoloration of water observed. Local residents reporting breathing difficulties.",
          category: "Public Safety", state: "Andhra Pradesh", district: "Visakhapatnam", locality: "Gajuwaka",
          latitude: 17.6905, longitude: 83.2095, status: "in_progress", votes: 89, is_high_priority: 1
        },
        {
          title: "Death Trap: Unmarked Excavation on Siripuram Junction Road",
          description: "A 10-foot deep pit left open without barricades or lights. Three accidents reported in 48 hours.",
          category: "Roads", state: "Andhra Pradesh", district: "Visakhapatnam", locality: "Siripuram",
          latitude: 17.7224, longitude: 83.3151, status: "not_started", votes: 67, is_high_priority: 1
        },
        {
          title: "Massive Garbage Accumulation near Port Hospital",
          description: "Biological waste and stagnant water causing severe hygiene issues.",
          category: "Sanitation", state: "Andhra Pradesh", district: "Visakhapatnam", locality: "Beach Road",
          latitude: 17.7185, longitude: 83.3314, status: "in_progress", votes: 45, is_high_priority: 0
        }
      ];

      for (const issueData of issues) {
        const newIssue = await Issue.create({
          ...issueData,
          assigned_corporation: assignCorporation(issueData.category)
        });
        await Timeline.create({ issue_id: newIssue._id, status: 'not_started', note: 'Issue reported by citizen.' });
      }
    }
};

// ─── APP SETUP ────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '10mb' }));

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

// MOUNTING DEFENSIVELY (matches both with and without /api prefix)
router.get("/admin/emergency-reset", async (req, res) => {
    try {
        await connectDB();
        await seedUsers(true);
        res.json({ success: true, message: "Admin password has been reset to 'admin123'. Please log in now." });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/auth/register", async (req, res) => {
    try {
        await connectDB();
        const email = req.body.email.toLowerCase().trim();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({ email, password: hashedPassword, role: req.body.role || 'user' });
        res.json({ id: newUser._id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        await connectDB();
        await seedUsers();
        await seedIssues();

        // One-time migrations
        const oldName = await Issue.countDocuments({ assigned_corporation: 'EPDCL' });
        if (oldName > 0) {
            await Issue.updateMany({ assigned_corporation: 'EPDCL' }, { $set: { assigned_corporation: 'EDPCL' } });
        }

        const email = (req.body.email || "").toLowerCase().trim();
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
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

    const corporationQuery = req.query.corporation as string;
    if (corporationQuery && corporationQuery !== 'all') {
      Object.assign(query, buildCorpFilter(corporationQuery));
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.json(issues.map(i => ({ ...i.toObject(), id: i._id, created_at: (i as any).createdAt })));
});

router.post("/issues", multer({ storage: multer.memoryStorage() }).single("photo"), async (req, res) => {
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
        const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, { $inc: { votes: 1 } }, { new: true });
        if (updatedIssue && updatedIssue.votes >= 10 && !updatedIssue.is_high_priority) {
            updatedIssue.is_high_priority = 1;
            await updatedIssue.save();
        }
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
    try {
        await connectDB();
        const corporationQuery = req.query.corporation as string;
        let matchQuery: any = {};

        if (corporationQuery && corporationQuery !== 'all') {
          matchQuery = buildCorpFilter(corporationQuery);
        }

        const total = await Issue.countDocuments(matchQuery);
        const resolved = await Issue.countDocuments({ ...matchQuery, status: 'resolved' });
        const notStarted = await Issue.countDocuments({ ...matchQuery, status: 'not_started' });
        const inProgress = await Issue.countDocuments({ ...matchQuery, status: 'in_progress' });
        const pending = await Issue.countDocuments({ ...matchQuery, status: { $nin: ['resolved'] } });
        const highPriority = await Issue.countDocuments({ ...matchQuery, is_high_priority: 1 });

        const byCategory = await Issue.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { _id: 0, category: "$_id", count: 1 } }
        ]);

        const byStatus = await Issue.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { _id: 0, status: "$_id", count: 1 } }
        ]);

        const byCorporation = await Issue.aggregate([
            { $match: { assigned_corporation: { $ne: null } } },
            { $group: { _id: "$assigned_corporation", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } }
        ]);

        res.json({ total, resolved, notStarted, inProgress, pending, highPriority, byCategory, byStatus, byCorporation });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.use("/api", router);
app.use("/", router);

export default app;
