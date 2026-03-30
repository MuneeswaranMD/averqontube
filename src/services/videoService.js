import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, setDoc } from "firebase/firestore";

const CACHE_COLLECTION = "video_cache";
const RSS_FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uYZ5gzMCURQ"; // Example ID

export const fetchVideosFromRSS = async (channelId) => {
  try {
    // In a real app, you'd use a proxy or serverless function to fetch RSS
    // due to CORS. For this demo, we'll simulate the fetch logic.
    console.log(`Fetching RSS for channel: ${channelId}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return dummy data structure that matches what you'd parse from XML
    return [
      { id: "rss1", title: "New Release: Future of Design", publishedAt: new Date().toISOString(), thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479", views: "0" },
      // ... more items
    ];
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return [];
  }
};

export const cacheVideos = async (videos) => {
  try {
    const cacheRef = doc(db, CACHE_COLLECTION, "latest_videos");
    await setDoc(cacheRef, {
      videos,
      updatedAt: new Date().toISOString()
    });
    console.log("Videos cached successfully");
  } catch (error) {
    console.error("Error caching videos:", error);
  }
};

export const getCachedVideos = async () => {
  try {
    const cacheRef = doc(db, CACHE_COLLECTION, "latest_videos");
    const cacheSnap = await getDoc(cacheRef);
    
    if (cacheSnap.exists()) {
      return cacheSnap.data().videos;
    }
    return null;
  } catch (error) {
    console.error("Error getting cached videos:", error);
    return null;
  }
};

/**
 * Main function to get videos: 
 * 1. Checks cache
 * 2. If no cache or old, fetches RSS
 * 3. Updates cache
 */
export const getVideos = async (channelId) => {
  const cached = await getCachedVideos();
  if (cached) return cached;
  
  const fresh = await fetchVideosFromRSS(channelId);
  if (fresh.length > 0) {
    await cacheVideos(fresh);
    return fresh;
  }
  
  return []; // Fallback
};
