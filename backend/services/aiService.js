const fs = require('fs');
const path = require('path');

const aiDataPath = path.join(__dirname, '../data/ai_data.json');

// ── Cache — baar baar disk read nahi ─────────────────────────────────
let aiDataCache = null;
const getAiData = () => {
    if (!aiDataCache) {
        const raw = fs.readFileSync(aiDataPath, 'utf8');
        aiDataCache = JSON.parse(raw);
    }
    return aiDataCache;
};

// ── Niche similarity groups ───────────────────────────────────────────
const NICHE_GROUPS = [
    ['food', 'beverage', 'restaurant', 'coffee', 'gourmet'],
    ['fashion', 'luxury', 'apparel', 'retail', 'sustainable'],
    ['fitness', 'health', 'wellness', 'sports', 'gym'],
    ['tech', 'gadgets', 'electronics', 'smart home', 'mobile'],
    ['beauty', 'skincare', 'organic', 'cosmetics'],
    ['finance', 'crypto', 'investment', 'financial'],
    ['education', 'edtech', 'online education', 'learning'],
    ['travel', 'airlines', 'tourism'],
    ['gaming', 'hardware', 'esports'],
    ['pets', 'pet care', 'animals'],
];

// ── Step 1: JSON se best matching entry dhundho ───────────────────────
// JSON mein profile_url nahi hai — brand_fit + sentiment se match karo
const findBestJsonMatch = (aiData, influencerNiche, campaignNiche) => {
    const niche = (influencerNiche || campaignNiche || '').toLowerCase();

    // Pass 1: Exact brand_fit match
    const exactMatches = aiData.filter(item =>
        item.brand_fit?.toLowerCase().includes(niche) ||
        niche.includes(item.brand_fit?.toLowerCase())
    );
    if (exactMatches.length > 0) {
        // Exact matches mein se random ek lo — variety ke liye
        return exactMatches[Math.floor(Math.random() * exactMatches.length)];
    }

    // Pass 2: Related niche group match
    for (const group of NICHE_GROUPS) {
        const nicheInGroup = group.some(g => niche.includes(g));
        if (nicheInGroup) {
            const groupMatches = aiData.filter(item =>
                group.some(g => item.brand_fit?.toLowerCase().includes(g))
            );
            if (groupMatches.length > 0) {
                return groupMatches[Math.floor(Math.random() * groupMatches.length)];
            }
        }
    }

    // Pass 3: Koi match nahi mila — random entry lo (fallback)
    return aiData[Math.floor(Math.random() * aiData.length)];
};

// ── Step 2: Real metrics se score calculate karo ─────────────────────
const calculateRealScore = (influencerData, jsonEntry, campaignNiche) => {
    const followers   = influencerData.follower_count || 0;
    const engRate     = parseFloat(String(influencerData.engagement_rate).replace('%', '')) || 0;
    const totalVideos = influencerData.total_videos || 0;
    const platform    = (influencerData.platform || '').toLowerCase();

    // ── Follower Score: Log scale (micro vs macro fair treatment) ──
    // 1K=20, 10K=40, 100K=60, 500K=80, 1M+=100
    const followerScore = followers > 0
        ? Math.min(Math.round((Math.log10(followers) / Math.log10(1_000_000)) * 100), 100)
        : 0;

    // ── Engagement Score: Platform benchmarks ke against ──
    // TikTok avg: 5-9%, YouTube avg: 2-5%
    const benchmarks = {
        tiktok:  { excellent: 9,  good: 5,  avg: 2 },
        youtube: { excellent: 5,  good: 2,  avg: 0.8 },
        default: { excellent: 6,  good: 3,  avg: 1 },
    };
    const bench = benchmarks[platform] || benchmarks.default;
    let engagementScore;
    if (engRate >= bench.excellent)     engagementScore = 100;
    else if (engRate >= bench.good)     engagementScore = Math.round(60 + ((engRate - bench.good) / (bench.excellent - bench.good)) * 40);
    else if (engRate >= bench.avg)      engagementScore = Math.round(30 + ((engRate - bench.avg) / (bench.good - bench.avg)) * 30);
    else                                engagementScore = Math.round((engRate / bench.avg) * 30);

    // ── Content Consistency Score ──
    const consistencyScore =
        totalVideos >= 500 ? 100 :
        totalVideos >= 200 ? 80  :
        totalVideos >= 100 ? 60  :
        totalVideos >= 50  ? 40  :
        totalVideos >= 10  ? 20  : 5;

    // ── JSON AI Score as quality signal ──
    // JSON mein jo score hai wo brand fit + sentiment ka data hai
    // Use karo as a quality modifier (±15 range)
    const jsonScoreNormalized = jsonEntry?.ai_score || 75;
    const jsonModifier = ((jsonScoreNormalized - 75) / 25) * 15; // -15 to +15 range

    // ── Final Weighted Score ──
    // Engagement sabse important (45%), followers (30%), consistency (15%), json modifier (10%)
    const rawScore =
        (engagementScore  * 0.45) +
        (followerScore    * 0.30) +
        (consistencyScore * 0.15) +
        (jsonScoreNormalized * 0.10);

    // Clamp 1-100
    return Math.min(Math.max(Math.round(rawScore), 1), 100);
};

// ── Step 3: Dynamic summary banao ────────────────────────────────────
const buildSummary = (influencerData, finalScore, jsonEntry, campaignNiche) => {
    const name       = influencerData.nickname || 'This creator';
    const followers  = (influencerData.follower_count || 0).toLocaleString();
    const engRate    = influencerData.engagement_rate || 'N/A';
    const niche      = influencerData.niche || campaignNiche || 'content';
    const sentiment  = jsonEntry?.sentiment || 'Positive';
    const brandFit   = jsonEntry?.brand_fit || niche;

    const tier =
        finalScore >= 85 ? 'an exceptional'  :
        finalScore >= 70 ? 'a strong'         :
        finalScore >= 55 ? 'a solid'          :
        finalScore >= 40 ? 'a moderate'       : 'a developing';

    const sentimentLine =
        sentiment === 'Very Positive'   ? 'Audience sentiment is overwhelmingly positive.' :
        sentiment === 'Positive'        ? 'Audience sentiment is positive and engaged.'     :
        sentiment === 'High Engagement' ? 'Audience shows exceptionally high engagement.'   :
        sentiment === 'Neutral'         ? 'Audience sentiment is stable and neutral.'       :
        'Audience sentiment requires monitoring.';

    return `${name} is ${tier} match with ${followers} followers and ${engRate} engagement rate in the ${niche} space. ` +
           `${sentimentLine} ` +
           `Brand alignment with ${brandFit} campaigns is strong. ` +
           `AI confidence score: ${finalScore}/100.`;
};

// ── Main Export ───────────────────────────────────────────────────────
const analyzeInfluencer = async (influencerData, campaignContext = {}) => {
    try {
        const aiData = getAiData();
        const campaignNiche = campaignContext?.niche || influencerData.niche || '';

        // 1. JSON se best matching entry dhundho
        const jsonEntry = findBestJsonMatch(aiData, influencerData.niche, campaignNiche);

        // 2. Real metrics se score calculate karo
        const finalScore = calculateRealScore(influencerData, jsonEntry, campaignNiche);

        // 3. Summary banao
        const summary = buildSummary(influencerData, finalScore, jsonEntry, campaignNiche);

        console.log(`✅ AI Score [${influencerData.nickname}]: ${finalScore} | Engagement: ${influencerData.engagement_rate} | Followers: ${influencerData.follower_count}`);

        return {
            score:     finalScore,          // campaignController mein aiData?.score use hota hai
            ai_score:  finalScore,          // dono rakh lo safety ke liye
            sentiment: jsonEntry?.sentiment || 'Neutral',
            brand_fit: jsonEntry?.brand_fit || campaignNiche || 'General',
            summary:   summary,             // campaignController mein aiData?.summary
            reasoning: `Score based on: Engagement(${influencerData.engagement_rate}), Followers(${influencerData.follower_count}), Videos(${influencerData.total_videos || 0}), JSON match: ${jsonEntry?.brand_fit}`
        };

    } catch (error) {
        console.error('❌ AI Analysis Error:', error.message);
        return {
            score:    50,
            ai_score: 50,
            sentiment: 'Neutral',
            brand_fit: 'General',
            summary:  'AI analysis unavailable.',
            reasoning: 'Error during analysis.'
        };
    }
};

module.exports = { analyzeInfluencer };