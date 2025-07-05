import React from "react";
import { useNavigate } from "react-router-dom";

// SVG ICONS for each genre (simple, minimal, and built-in for no dependencies)
const genreIcons = {
  Sports: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#F7B731" opacity="0.18" />
      <circle cx="24" cy="24" r="14" fill="#F7B731" />
      <path d="M32 20c0 4.42-3.58 8-8 8s-8-3.58-8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2" fill="#fff" />
    </svg>
  ),
  Science: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="34" rx="10" ry="4" fill="#36D1C4" opacity="0.18" />
      <ellipse cx="24" cy="30" rx="6" ry="10" fill="#36D1C4" />
      <circle cx="24" cy="20" r="4" fill="#fff" />
      <ellipse cx="24" cy="26" rx="2" ry="1.5" fill="#fff" opacity="0.8" />
    </svg>
  ),
  Technology: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <rect x="9" y="11" width="30" height="22" rx="5" fill="#5B86E5" />
      <rect x="19" y="31" width="10" height="4" rx="2" fill="#fff" />
      <circle cx="24" cy="22" r="6" fill="#fff" opacity="0.7" />
      <rect x="20" y="18" width="8" height="8" rx="4" fill="#5B86E5" opacity="0.4" />
    </svg>
  ),
  Films: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="16" width="32" height="16" rx="4" fill="#F7B731" />
      <rect x="8" y="16" width="8" height="16" rx="4" fill="#fff" opacity="0.7" />
      <circle cx="20" cy="24" r="2" fill="#fff" />
      <circle cx="28" cy="24" r="2" fill="#fff" />
      <rect x="12" y="20" width="24" height="8" rx="4" fill="#36D1C4" opacity="0.4" />
    </svg>
  ),
  History: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <rect x="12" y="14" width="24" height="20" rx="4" fill="#36D1C4" />
      <rect x="16" y="18" width="16" height="2" rx="1" fill="#fff" />
      <rect x="16" y="22" width="16" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="16" y="26" width="9" height="2" rx="1" fill="#fff" opacity="0.7" />
      <circle cx="34" cy="34" r="4" fill="#F7B731" />
    </svg>
  ),
  Health: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="33" rx="12" ry="7" fill="#5B86E5" opacity="0.18" />
      <path d="M24 32s-6-3-10-9c-5.5-8 8.5-14 10-6 1.5-8 15.5-2 10 6-4 6-10 9-10 9z" fill="#5B86E5" />
      <path d="M24 25v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 28.5h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Literature: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <rect x="14" y="16" width="20" height="16" rx="3" fill="#F7B731" />
      <rect x="14" y="16" width="6" height="16" rx="3" fill="#fff" opacity="0.7" />
      <rect x="24" y="16" width="10" height="16" rx="3" fill="#36D1C4" opacity="0.6" />
      <rect x="17" y="21" width="8" height="2" rx="1" fill="#fff" />
      <rect x="17" y="25" width="8" height="2" rx="1" fill="#fff" opacity="0.7" />
    </svg>
  ),
};

const genres = [
  { name: "Sports", color: "#F7B731" },
  { name: "Science", color: "#36D1C4" },
  { name: "Technology", color: "#5B86E5" },
  { name: "Films", color: "#F7B731" },
  { name: "History", color: "#36D1C4" },
  { name: "Health", color: "#5B86E5" },
  { name: "Literature", color: "#F7B731" },
];

/*
// Removed duplicate: import { useNavigate } from "react-router-dom";
*/

// PUBLIC_INTERFACE
function GenreGrid() {
  /**
   * Grid component that displays all genres with icons and modern styling.
   * Clicking a genre navigates to the Article page for that genre.
   */
  const navigate = useNavigate();

  // Handler for clicking or keyboard-activating a card
  const handleGenreSelect = (genreName) => {
    navigate("/article", { state: { genre: genreName } });
  };

  // For accessibility, support Enter/Space key activation on card
  const handleKeyDown = (e, genreName) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleGenreSelect(genreName);
    }
  };

  return (
    <div className="genre-grid">
      {genres.map((genre) => (
        <div
          key={genre.name}
          className="genre-card"
          style={{
            background: "var(--bg-secondary)",
            border: `2px solid ${genre.color}33`,
            boxShadow: `0 2px 8px 0 ${genre.color}22`,
          }}
          tabIndex={0}
          role="button"
          aria-label={genre.name}
          onClick={() => handleGenreSelect(genre.name)}
          onKeyDown={(e) => handleKeyDown(e, genre.name)}
        >
          <span className="genre-icon">{genreIcons[genre.name]}</span>
          <span className="genre-label">{genre.name}</span>
        </div>
      ))}
    </div>
  );
}

export default GenreGrid;
