import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
});

const User = mongoose.model('User', UserSchema);

async function checkUsers() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error("MONGODB_URI not found");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({});
        console.log("Found users:", users.length);
        for (const user of users) {
            console.log(`- ${user.email} (Role: ${user.role})`);
        }

        // Check specific ones
        const admin = await User.findOne({ email: "admin@civicconnect.com" });
        if (admin) {
            const isMatch = await bcrypt.compare("admin123", admin.password);
            console.log(`Admin check: ${isMatch ? "Password matches" : "Password DOES NOT match"}`);
        } else {
            console.log("Admin user NOT found");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkUsers();
