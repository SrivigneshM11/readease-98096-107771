//
// articleService.js
//
// Provides a function to fetch news articles by genre from newsdata.io API.
// Uses `fetch`. See instructions below for API key provisioning.
//
// Usage:
//   import { fetchArticlesByGenre } from "./articleService";
//   const articles = await fetchArticlesByGenre("sports");
//

/**
 * Fetch articles from NewsData.io by genre using public API key, always including language=en and category=GENRE.
 * @param {string} genre - The genre to fetch articles for (e.g., "sports", "science").
 * @returns {Promise<object[]>} Array of article objects (from API response).
 * @throws {Error} If fetch fails or API returns error.
 *
 * Uses API key: pub_87bf9f5b87b64ece98a894f9fa41c70a (hardcoded)
 * API documentation: https://newsdata.io/docs
 * Example: https://newsdata.io/api/1/news?apikey=pub_87bf9f5b87b64ece98a894f9fa41c70a&language=en&category=sports
 */
// PUBLIC_INTERFACE
export async function fetchArticlesByGenre(genre) {
  // Provided API key as per instructions
  const API_KEY = "pub_87bf9f5b87b64ece98a894f9fa41c70a";

  // Always force language=en for consistent results
  const supportedCategories = [
    "business",
    "entertainment",
    "environment",
    "food",
    "health",
    "politics",
    "science",
    "sports",
    "technology",
    "top",
    "world"
  ];

  // Clean up user input for mapping
  const normalized = String(genre || "").trim().toLowerCase();
  // Map UI genres to NewsData category values (default is passthrough, but e.g. "literature" becomes "entertainment")
  const category =
    supportedCategories.find((cat) => cat === normalized) ||
    (normalized === "literature" ? "entertainment" : null) ||
    (normalized === "films" ? "entertainment" : null);

  // Always include language=en and category=GENRE in the URL as required
  const params = new URLSearchParams({
    apikey: API_KEY,
    language: "en",
    // If we have a mapped category, use it; otherwise, fallback to query (should not typically hit this)
    ...(category ? { category } : normalized ? { q: normalized } : {})
  });

  const url = `https://newsdata.io/api/1/news?${params.toString()}`;

  // Diagnostics in development (optional)
  if (typeof window !== "undefined" && window.location && window.location.hostname === "localhost") {
    // eslint-disable-next-line
    console.info("[NewsData.io] Fetching articles with URL:", url);
  }

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // eslint-disable-next-line
    console.error("[NewsData.io] Network or fetch error:", err);
    throw new Error("[NewsData.io] Failed to fetch articles: " + err.message);
  }

  if (!res.ok) {
    let reason = `[NewsData.io] API error: HTTP ${res.status}`;
    if (res.status === 401) {
      reason += " (Unauthorized: Check API key and quota)";
      // eslint-disable-next-line
      console.error(reason, { attemptedUrl: url, usingKey: API_KEY ? "SET" : "NOT SET" });
    }
    throw new Error(reason);
  }
  const data = await res.json();
  if (data.status !== "success" || !Array.isArray(data.results)) {
    throw new Error(
      "Unexpected NewsData API response: " +
        (data.status || "no status") +
        " - " +
        (data.message || "no message")
    );
  }
  return data.results;
}

/**
 * To configure the API key for local development:
 *  1. Add a file named `.env` in the project root (same directory as package.json)
 *  2. Add:  REACT_APP_NEWSDATA_API_KEY=your_actual_key_here
 *  3. Restart your development server (npm start)
 *
 * On deploy, use your hosting provider's environment variable settings (with the same REACT_APP_NEWSDATA_API_KEY name).
 */
