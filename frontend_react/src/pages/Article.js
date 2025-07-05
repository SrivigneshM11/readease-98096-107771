import React from "react";

// PUBLIC_INTERFACE
function Article() {
  /** Article reading page (placeholder) */
  return (
    <section>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: 20 }}>
        Article Title Placeholder
      </h1>
      <div style={{ maxWidth: 680, margin: "auto", textAlign: "left", color: "var(--text-primary)", background: "var(--bg-secondary)", borderRadius: 12, padding: 24 }}>
        <p>
          [This is a placeholder for the article content. The full article text for the selected genre will appear here.]
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
          Features like Next Article, Read-Aloud, and Tap-to-Define will be available on this page.
        </p>
      </div>
    </section>
  );
}

export default Article;
