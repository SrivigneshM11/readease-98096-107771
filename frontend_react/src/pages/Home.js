import React from "react";

// PUBLIC_INTERFACE
function Home() {
  /** Home page for genre selection (placeholder) */
  return (
    <section>
      <h1 style={{ fontSize: "2.4rem", fontWeight: 700, marginBottom: 24 }}>
        Select a Genre
      </h1>
      <div>
        {/* Placeholder description; will be replaced by genre grid/list */}
        <p style={{ maxWidth: 480, margin: "auto", color: "var(--text-secondary)" }}>
          Choose your favorite genre to start reading engaging articles. Explore Sports, Science, Technology, Films, History, Health, and Literature.
        </p>
      </div>
    </section>
  );
}

export default Home;
