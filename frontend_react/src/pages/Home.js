import React from "react";
import GenreGrid from "../components/GenreGrid";

// PUBLIC_INTERFACE
function Home() {
  /** Home page for genre selection - displays genre grid */
  // Navigation is handled by GenreGrid for routing to the Article page.
  return (
    <section>
      <h1 style={{ fontSize: "2.4rem", fontWeight: 700, marginBottom: 24 }}>
        Select a Genre
      </h1>
      <p
        style={{
          maxWidth: 480,
          margin: "auto",
          color: "var(--text-secondary)",
          marginBottom: 0,
          fontSize: "1.06rem",
        }}
      >
        Choose your favorite genre to start reading engaging articles.
      </p>
      <GenreGrid />
    </section>
  );
}

export default Home;
