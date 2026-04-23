// ============================================================
// FILE: scripts/migrateCreatedBy.js
// USAGE: node scripts/migrateCreatedBy.js
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const Influencer = require('../models/Influencer');

const OWNER_USER_ID = '69a7b37cfde1b67338fc2ebb';

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Pehle total check karo
        const total = await Influencer.countDocuments();
        console.log(`📊 Total influencers in DB: ${total}`);

        // createdBy missing YA null — dono fix karo
        const result = await Influencer.updateMany(
            {
                $or: [
                    { createdBy: { $exists: false } },
                    { createdBy: null },
                ]
            },
            { $set: { createdBy: new mongoose.Types.ObjectId(OWNER_USER_ID) } }
        );

        console.log(`✅ Migration complete!`);
        console.log(`   Matched:  ${result.matchedCount} influencers`);
        console.log(`   Modified: ${result.modifiedCount} influencers`);

        // Verify karo
        const withCreatedBy    = await Influencer.countDocuments({ createdBy: { $exists: true, $ne: null } });
        const withoutCreatedBy = await Influencer.countDocuments({ $or: [{ createdBy: { $exists: false } }, { createdBy: null }] });

        console.log(`\n📋 Verification:`);
        console.log(`   ✅ createdBy set:     ${withCreatedBy}`);
        console.log(`   ❌ createdBy missing: ${withoutCreatedBy}`);

        // Platform breakdown
        const tiktok  = await Influencer.countDocuments({ platform: 'TikTok' });
        const youtube = await Influencer.countDocuments({ platform: 'YouTube' });
        console.log(`\n🎵 TikTok:  ${tiktok}`);
        console.log(`▶️  YouTube: ${youtube}`);

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 MongoDB disconnected');
    }
};

run();