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
export async function fetchArticlesByGenre(genre) {
  const API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY;  // Must be set in .env as REACT_APP_NEWSDATA_API_KEY
  if (!API_KEY) {
    throw new Error(
      "NewsData.io API key is not set. Create a .env file with REACT_APP_NEWSDATA_API_KEY=YOUR_API_KEY"
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

  // Build the request URL
  const url = `https://newsdata.io/api/1/news?${params.toString()}`;

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error("Failed to fetch articles: " + err.message);
  }

  if (!res.ok) {
    throw new Error(`NewsData API error: HTTP ${res.status}`);
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
