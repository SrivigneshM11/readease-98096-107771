import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleView from "../components/ArticleView";
import { fetchArticlesByGenre } from "../services/articleService";

// PUBLIC_INTERFACE
function Article() {
  /**
   * Article page - fetches and displays live articles for the selected genre.
   * Accepts the genre via React Router navigation state.
   * Shows loading and error states and cycles through real articles.
   */
  const location = useLocation();
  const navigate = useNavigate();

  // Accept genre parameter via navigation state (from GenreGrid)
  const genre =
    location.state && location.state.genre
      ? location.state.genre
      : null;

  // Valid genre check
  const displayGenre = genre || "Science";

  // UI state: articles data, loading/errors, cycling
  const [articleList, setArticleList] = useState([]);
  const [articleIdx, setArticleIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles on genre change
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setArticleList([]);
    setArticleIdx(0);

    fetchArticlesByGenre(displayGenre)
      .then((articles) => {
        if (ignore) return;
        // Only keep those articles with reasonable content
        const cleaned = Array.isArray(articles)
          ? articles.filter(
              (a) =>
                a.title &&
                (a.description || a.content || a.link)
            )
          : [];
        if (cleaned.length === 0) {
          setError("No articles available for this genre.");
        }
        setArticleList(cleaned);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setError(
          err.message ||
            "Failed to load articles. Please try again later."
        );
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [displayGenre]);

  // Next article cycling
  const handleNextArticle = () => {
    if (articleList.length === 0) return;
    setArticleIdx((prevIdx) => (prevIdx + 1) % articleList.length);
  };

  // If genre not known in navigation
  if (!genre) {
    return (
      <section style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
        <h2>Genre not selected</h2>
        <p>
          Please return to the <b>Home</b> page and select a genre to read a relevant article.
        </p>
        <button
          className="btn"
          style={{ marginTop: 22 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section style={{ maxWidth: 660, margin: "54px auto", textAlign: "center" }}>
        <h2>Loading articles in <span style={{ color: "var(--text-secondary)" }}>{displayGenre}</span>…</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, marginTop: 10 }}>
          Please wait while we fetch the latest articles.
        </p>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section style={{ maxWidth: 640, margin: "42px auto", textAlign: "center" }}>
        <h2>Error fetching articles</h2>
        <p style={{ color: "#b00020" }}>{error}</p>
        <button
          className="btn"
          style={{ marginTop: 20, marginRight: 14 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
        <button
          className="btn"
          style={{ marginTop: 20 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </section>
    );
  }

  if (articleList.length === 0) {
    return (
      <section style={{ maxWidth: 660, margin: "52px auto", textAlign: "center" }}>
        <h2>No articles found</h2>
        <p>
          Sorry, we couldn't find any recent articles for this genre.<br />
          Please try another genre.
        </p>
        <button
          className="btn"
          style={{ marginTop: 22 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </section>
    );
  }

  const thisArticle = articleList[articleIdx];

  // Prepare a basic content block for display
  const articleContent = (
    <>
      {thisArticle.description ? <p>{thisArticle.description}</p> : null}
      {/* NewsData sometimes gives a 'content' or 'full_text' field */}
      {thisArticle.content && (!thisArticle.description ||
        thisArticle.content !== thisArticle.description) ? (
        <p>{thisArticle.content}</p>
      ) : null}
      {/* Link to the original if present */}
      {thisArticle.link ? (
        <p style={{ marginTop: 20 }}>
          <a
            href={thisArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-secondary)", textDecoration: "underline" }}
          >
            Read Full Article
          </a>
        </p>
      ) : null}
    </>
  );

  return (
    <ArticleView
      title={thisArticle.title}
      content={articleContent}
      onNextArticle={handleNextArticle}
    />
  );
}

export default Article;
