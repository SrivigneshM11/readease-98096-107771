import React from "react";

// PUBLIC_INTERFACE
function ArticleView({ title, content, onNextArticle }) {
  /**
   * ArticleView: Displays an article with modern fonts, excellent spacing,
   * and a "Next Article" button at the bottom. Designed for maximum readability.
   * @param {string} title - The article headline/title.
   * @param {string|JSX.Element} content - The article body content.
   * @param {function} onNextArticle - Callback for loading the next article.
   */
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 740,
        margin: "32px auto 0 auto",
        background: "var(--bg-secondary)",
        borderRadius: 20,
        boxShadow: "0 2px 22px 0 rgba(90,110,210,0.05)",
        padding: "40px 26px 32px 26px",
        color: "var(--text-primary)",
        fontFamily: `'Segoe UI', 'Roboto', 'Oxygen', 'Fira Sans', sans-serif`,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
      aria-label="Reading Article"
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          margin: "0 0 16px 0",
          letterSpacing: "0.01em",
          lineHeight: 1.17,
          textAlign: "left",
        }}
      >
        {title}
      </h1>
      <article
        style={{
          fontSize: "1.19rem",
          lineHeight: 1.68,
          marginBottom: 36,
          textAlign: "left",
          letterSpacing: "0.01em",
          wordBreak: "break-word",
        }}
      >
        {content}
      </article>
      <button
        type="button"
        aria-label="Next Article"
        className="btn btn-large"
        style={{
          alignSelf: "center",
          background: "linear-gradient(90deg, var(--text-secondary), var(--button-bg))",
          color: "var(--button-text)",
          fontSize: "1.09rem",
          fontWeight: 600,
          border: "none",
          borderRadius: 8,
          padding: "14px 38px",
          marginTop: "20px",
          letterSpacing: "0.03em",
          boxShadow: "0 2px 8px 0 rgba(70,120,140,0.09)",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.11s",
        }}
        onClick={onNextArticle}
      >
        Next Article →
      </button>
    </section>
  );
}

export default ArticleView;
