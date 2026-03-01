const axios = require('axios');
const YT_API_KEY = process.env.YT_API_KEY;

if (!YT_API_KEY) {
    throw new Error("YouTube API key missing in .env file");
}

const searchYouTubeInfluencers = async (keyword) => {
    try {
        console.log(`[YouTube API] Searching: ${keyword} Pakistan`);

        // Step 1: Search Channels
        const searchResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    part: 'snippet',
                    type: 'channel',
                    q: `${keyword} Pakistan`,
                    maxResults: 5,
                    regionCode: 'PK',
                    key: YT_API_KEY
                }
            }
        );

        const items = searchResponse.data.items || [];
        if (items.length === 0) return [];

        // Step 2: Get All Channel IDs
        const channelIds = items.map(item => item.snippet.channelId).join(',');

        // Step 3: Fetch Statistics
        const statsResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/channels',
            {
                params: {
                    part: 'statistics,snippet',
                    id: channelIds,
                    key: YT_API_KEY
                }
            }
        );

        const channels = statsResponse.data.items || [];
        const influencers = [];

        // Step 4: Fetch Recent Videos for Engagement Rate
        for (const channel of channels) {
            try {
                // Get 5 recent videos to calculate average engagement
                const videosResponse = await axios.get(
                    'https://www.googleapis.com/youtube/v3/search',
                    {
                        params: {
                            part: 'snippet',
                            channelId: channel.id,
                            maxResults: 5,
                            order: 'date',
                            type: 'video',
                            key: YT_API_KEY
                        }
                    }
                );

                const videoItems = videosResponse.data.items || [];
                const videoIds = videoItems.map(v => v.id.videoId).join(',');

                let totalLikes = 0;
                let totalComments = 0;

                if (videoIds) {
                    // Get stats for those 5 videos
                    const videoStatsResponse = await axios.get(
                        'https://www.googleapis.com/youtube/v3/videos',
                        {
                            params: {
                                part: 'statistics',
                                id: videoIds,
                                key: YT_API_KEY
                            }
                        }
                    );
                    
                    videoStatsResponse.data.items.forEach(v => {
                        totalLikes += Number(v.statistics.likeCount || 0);
                        totalComments += Number(v.statistics.commentCount || 0);
                    });
                }

                // --- CALCULATION LOGIC ---
                const subscribers = Number(channel.statistics?.subscriberCount || 0);
                const engagement = totalLikes + totalComments;
                
                // Average engagement over 5 videos divided by subscribers
                let calculatedRate = subscribers > 0 
                    ? ((engagement / 5) / subscribers) * 100 
                    : 0;

                influencers.push({
                    platform: "YouTube",
                    profile_username: channel.id,
                    nickname: channel.snippet.title,
                    profile_url: `https://www.youtube.com/channel/${channel.id}`,
                    avatar: channel.snippet?.thumbnails?.high?.url || "",
                    follower_count: subscribers,
                    total_views: Number(channel.statistics?.viewCount || 0),
                    total_videos: Number(channel.statistics?.videoCount || 0),
                    // engagement_rate is a string in Model
                    engagement_rate: calculatedRate.toFixed(2) + "%", 
                    niche: keyword.charAt(0).toUpperCase() + keyword.slice(1),
                    last_updated: new Date()
                });

            } catch (videoErr) {
                console.error("Error fetching video stats:", videoErr.message);
                // Push channel even if video stats fail
            }
        }

        console.log(`Success: ${influencers.length} channels fetched.`);
        return influencers;

    } catch (error) {
        console.error("YouTube API Error:", error.message);
        return [];
    }
};

module.exports = { searchYouTubeInfluencers };