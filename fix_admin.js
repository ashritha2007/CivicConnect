import mongoose from 'mongoose';

// Bypassing DNS SRV lookups by specifying the replica set nodes directly
const directURI = "mongodb://harshithsai597_db_user:22may2007@cluster0-shard-00-00.ugtnghz.mongodb.net:27017,cluster0-shard-00-01.ugtnghz.mongodb.net:27017,cluster0-shard-00-02.ugtnghz.mongodb.net:27017/civic_connect?ssl=true&replicaSet=atlas-m1st8u-shard-0&authSource=admin&retryWrites=true&w=majority";

async function fixUser() {
    try {
        console.log("Connecting directly to replica set nodes...");
        await mongoose.connect(directURI);
        console.log("Connected successfully!");

        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String
        }, { strict: false }));

        console.log("Updating harshithsai597@gmail.com...");
        const res = await User.updateOne({ email: "harshithsai597@gmail.com" }, { $set: { role: "admin" } });
        console.log("Update Result:", res);

        const updated = await User.findOne({ email: "harshithsai597@gmail.com" });
        console.log("Updated User:", updated);

    } catch (e) {
        console.error("Failed to connect or update due to error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

fixUser();
