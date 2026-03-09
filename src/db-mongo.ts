import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI === 'mongodb+srv://harshithsai597_db_user:<db_password>@cluster0.ugtnghz.mongodb.net/') {
    throw new Error('Please define the MONGODB_URI environment variable inside .env and replace <db_password> with the actual password.');
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

export const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    reputation: { type: Number, default: 0 },
}, { timestamps: true });

export const IssueSchema = new Schema({
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

export const VoteSchema = new Schema({
    issue_id: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    ip_address: { type: String, required: true },
}, { timestamps: true });

// Compound index to ensure 1 vote per IP per issue
VoteSchema.index({ issue_id: 1, ip_address: 1 }, { unique: true });

export const CommentSchema = new Schema({
    issue_id: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    text: { type: String, required: true },
    user_role: { type: String, required: true },
}, { timestamps: true });

export const TimelineSchema = new Schema({
    issue_id: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    status: { type: String, required: true },
    note: { type: String },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Issue = mongoose.model('Issue', IssueSchema);
export const Vote = mongoose.model('Vote', VoteSchema);
export const Comment = mongoose.model('Comment', CommentSchema);
export const Timeline = mongoose.model('Timeline', TimelineSchema);
