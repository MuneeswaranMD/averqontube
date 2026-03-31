let CURRENT_API_KEY = localStorage.getItem('YT_API_OVERRIDE') || import.meta.env.VITE_YOUTUBE_API_KEY;
const DEFAULT_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

export const setApiOverride = (key) => {
    if (key) {
        localStorage.setItem('YT_API_OVERRIDE', key);
        CURRENT_API_KEY = key;
    } else {
        localStorage.removeItem('YT_API_OVERRIDE');
        CURRENT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    }
};

const getApiKey = () => CURRENT_API_KEY;

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const getCache = (key, customTtl = CACHE_TTL) => {
    const cached = localStorage.getItem(`yt_cache_${key}`);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > customTtl) {
        localStorage.removeItem(`yt_cache_${key}`);
        return null;
    }
    return data;
};

const setCache = (key, data) => {
    localStorage.setItem(`yt_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

/**
 * Fetch Channel Information
 */
export const fetchChannelDetails = async (identifier = DEFAULT_CHANNEL_ID) => {
    try {
        if (!identifier || !getApiKey()) return null;
        
        const cached = getCache(`channel_${identifier}`);
        if (cached) return cached;

        let url = `${BASE_URL}/channels?part=snippet,statistics,brandingSettings,contentDetails&key=${getApiKey()}`;
        if (identifier.startsWith('@')) {
            url += `&forHandle=${identifier}`;
        } else {
            url += `&id=${identifier}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (res.status === 403) throw new Error("QUOTA_EXCEEDED");

        if (!data.items?.length) {
            console.warn("No items found for:", identifier);
            return {
                id: identifier || 'invalid',
                name: identifier.startsWith('@') ? identifier.slice(1) : 'Transmission Core',
                description: 'Offline Hub',
                profileImageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=100&auto=format&fit=crop',
                bannerImageUrl: '',
                subscribers: 'N/A',
                totalViews: 'N/A',
                totalVideos: '0',
                uploadsPlaylistId: null
            };
        }
        
        const channel = data.items[0];
        const result = {
            id: channel.id,
            name: channel.snippet.title,
            description: channel.snippet.description,
            profileImageUrl: channel.snippet.thumbnails.high.url,
            bannerImageUrl: channel.brandingSettings?.image?.bannerExternalUrl || '',
            subscribers: formatCount(channel.statistics.subscriberCount),
            totalViews: formatCount(channel.statistics.viewCount),
            totalVideos: channel.statistics.videoCount,
            uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads
        };
        
        setCache(`channel_${identifier}`, result);
        return result;
    } catch (error) {
        console.error('Error fetching channel details:', error);
        if (error.message === "QUOTA_EXCEEDED") throw error; // Allow App.js to catch and show the override UI
        return null;
    }
};

/**
 * Fetch Videos from a Playlist
 */
export const fetchVideosFromPlaylist = async (playlistId, maxResults = 12) => {
    try {
        if (!playlistId || !getApiKey()) return [];
        
        const cached = getCache(`playlist_vids_${playlistId}`);
        if (cached) return cached;

        const res = await fetch(`${BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&key=${getApiKey()}`);
        const data = await res.json();

        if (res.status === 403) throw new Error("QUOTA_EXCEEDED");
        if (!data.items) return [];

        const result = data.items.map(item => ({
            id: item.contentDetails.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
            publishedAt: formatDate(item.snippet.publishedAt),
            views: 'Premium Stream',
            duration: '15:20',
            description: item.snippet.description
        }));
        
        setCache(`playlist_vids_${playlistId}`, result);
        return result;
    } catch (error) {
        console.error('Error fetching playlist videos:', error);
        return [];
    }
};

/**
 * Fetch Video Details
 */
export const fetchVideoDetails = async (videoIds) => {
    try {
        if (!videoIds || !getApiKey()) return [];
        const res = await fetch(`${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${getApiKey()}`);
        const data = await res.json();

        return data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
            publishedAt: formatDate(item.snippet.publishedAt),
            views: formatCount(item.statistics.viewCount),
            duration: formatDuration(item.contentDetails.duration),
            description: item.snippet.description
        }));
    } catch (error) {
        console.error('Error fetching video details:', error);
        return [];
    }
};

/**
 * Fetch Trending Videos for AI/IT in Tamil
 */
export const fetchTrendingVideos = async (maxResults = 14) => {
    try {
        if (!getApiKey()) return [];

        // Cache trending search for 24 HOURS because search endpoint costs 100 Quota units per request
        const cached = getCache(`trending_tamil`, 24 * 60 * 60 * 1000);
        if (cached) return cached;

        const queries = [
            "Tamil AI IT Tech News", 
            "Sora AI News Tamil", 
            "Claude 3 vs Gemini Pro Tamil", 
            "Tamil IT Career Growth 2024", 
            "Tamil Latest Hits 2024",
            "Tamil Melody Songs Playlist",
            "Nvidia AI GPU Tamil News",
            "Tamil Software Developer Roadmap"
        ];
        
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const searchRes = await fetch(`${BASE_URL}/search?part=snippet&q=${encodeURIComponent(randomQuery)}&relevanceLanguage=ta&regionCode=IN&type=video&order=viewCount&maxResults=${maxResults}&key=${getApiKey()}`);
        const searchData = await searchRes.json();

        if (searchRes.status === 403) throw new Error("QUOTA_EXCEEDED");
        if (!searchData.items?.length) return [];

        const videoIds = searchData.items.filter(item => item.id?.videoId).map(item => item.id.videoId).join(',');
        
        // Fetch full video details
        const detailsRes = await fetch(`${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${getApiKey()}`);
        const detailsData = await detailsRes.json();

        if (!detailsData.items) return [];

        const result = detailsData.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
            publishedAt: formatDate(item.snippet.publishedAt),
            views: formatCount(item.statistics.viewCount),
            duration: formatDuration(item.contentDetails.duration),
            description: item.snippet.description
        }));
        
        setCache(`trending_tamil`, result);
        return result;
    } catch (error) {
        console.error('Error fetching trending Tamil videos:', error);
        return [];
    }
};

/**
 * Search Videos
 */
export const searchVideos = async (query, maxResults = 12) => {
    try {
        if (!query || !getApiKey()) return [];

        const cached = getCache(`search_${query}`);
        if (cached) return cached;

        const searchRes = await fetch(`${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${getApiKey()}`);
        const searchData = await searchRes.json();

        if (searchRes.status === 403) throw new Error("QUOTA_EXCEEDED");
        if (!searchData.items?.length) return [];

        const videoIds = searchData.items.filter(item => item.id?.videoId).map(item => item.id.videoId).join(',');
        
        // Fetch full video details
        const detailsRes = await fetch(`${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${getApiKey()}`);
        const detailsData = await detailsRes.json();

        if (!detailsData.items) return [];

        const result = detailsData.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
            publishedAt: formatDate(item.snippet.publishedAt),
            views: formatCount(item.statistics.viewCount),
            duration: formatDuration(item.contentDetails.duration),
            description: item.snippet.description
        }));
        
        setCache(`search_${query}`, result);
        return result;
    } catch (error) {
        console.error('Error fetching search videos:', error);
        return [];
    }
};

/**
 * Fetch Playlists
 */
export const fetchChannelPlaylists = async (identifier = DEFAULT_CHANNEL_ID, maxResults = 8) => {
    try {
        if (!identifier || !getApiKey()) return [];
        
        let targetId = identifier;
        
        // If it's a handle, we must resolve it to an ID first
        if (identifier.startsWith('@')) {
            const channel = await fetchChannelDetails(identifier);
            if (!channel || channel.id === 'invalid') return [];
            targetId = channel.id;
        }

        const res = await fetch(`${BASE_URL}/playlists?part=snippet,contentDetails&channelId=${targetId}&maxResults=${maxResults}&key=${getApiKey()}`);
        const data = await res.json();
        
        if (!data.items) return [];

        return data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
            videoCount: item.contentDetails.itemCount,
            publishedAt: formatDate(item.snippet.publishedAt)
        }));
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }
};

/**
 * Helper to Format Duration
 */
const formatDuration = (isoDuration) => {
    if (!isoDuration) return '15:20';
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '15:20';
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Helper to Format Count
 */
const formatCount = (count) => {
    if (!count) return '0';
    const n = parseInt(count);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

/**
 * Helper to Format Date
 */
const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};
