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

// PUBLIC_INTERFACE
/**
 * Fetch articles from NewsData.io by genre.
 * @param {string} genre - The genre to fetch articles for (e.g., "sports", "science").
 * @returns {Promise<object[]>} Array of article objects (from API response).
 * @throws {Error} If fetch fails or API returns error.
 *
 * API documentation: https://newsdata.io/docs
 *
 * Note about API Key:
 *   - You need to provide your NewsData.io API key via environment variable.
 *   - In development, create a `.env` file at the project root with:
 *       REACT_APP_NEWSDATA_API_KEY=your_actual_newsdata_api_key_here
 *   - Restart `npm start` after editing .env.
 *   - Never commit .env with sensitive keys to your version control!
 */
/**
 * Enhanced diagnostics: Logs authentication setup and API errors for debugging HTTP 401 errors.
 */
export async function fetchArticlesByGenre(genre) {
  const API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY;  // Must be set in .env as REACT_APP_NEWSDATA_API_KEY

  // -- Diagnostic logging for runtime/build-time variable visibility --
  if (!API_KEY) {
    if (typeof window !== "undefined" && window.location && window.location.hostname === "localhost") {
      // eslint-disable-next-line
      console.error(
        "[NewsData.io] API key missing! Check .env in frontend_react, value for REACT_APP_NEWSDATA_API_KEY, and ensure you RESTARTED the dev server. The fetch will throw."
      );
    }
    throw new Error(
      "[NewsData.io] API key is not set (REACT_APP_NEWSDATA_API_KEY). " +
      "Create .env in your project root with REACT_APP_NEWSDATA_API_KEY=YOUR_API_KEY and restart the dev server."
    );
  }

  // NewsData genres map loosely from domain/keyword/category. See: https://newsdata.io/docs
  // We'll use 'category' if genre matches supported NewsData categories; fallback: treat as 'q' (query).
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
  const category =
    supportedCategories.find((cat) => cat === normalized) ||
    // Map to NewsData "literature" -> "entertainment" (closest), etc.
    (normalized === "literature" ? "entertainment" : null);

  const params = new URLSearchParams({
    apiKey: API_KEY,
    language: "en"
  });

  if (category) {
    params.append("category", category);
  } else if (normalized) {
    params.append("q", normalized);
  }

  // Build the request URL (log diagnostic info)
  const url = `https://newsdata.io/api/1/news?${params.toString()}`;

  // --- Diagnostics: Show the effective URL and API key status ---
  if (typeof window !== "undefined" && window.location && window.location.hostname === "localhost") {
    // eslint-disable-next-line
    console.info(`[NewsData.io] Fetching articles with URL:`, url);
    // eslint-disable-next-line
    console.info(`[NewsData.io] API key is${API_KEY ? " " : " NOT "}set.`);
  }

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // Extra diagnostics
    // eslint-disable-next-line
    console.error("[NewsData.io] Network or fetch error:", err);
    throw new Error("[NewsData.io] Failed to fetch articles: " + err.message);
  }

  if (!res.ok) {
    let reason = `[NewsData.io] API error: HTTP ${res.status}`;
    if (res.status === 401) {
      reason += " (Unauthorized: Check if your API key is correct and has quota. See docs for setup and ensure correct .env and restart.)";
      // eslint-disable-next-line
      console.error(reason, { attemptedUrl: url, usingKey: API_KEY ? "SET" : "NOT SET" });
    }
    throw new Error(reason);
  }
  const data = await res.json();
  /* Expected response:
     {
        status: "success",
        results: [
          {
            "title": "...",
            "description": "...",
            "link": "...",
            ...
          },
          ...
        ]
     }
  */
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
