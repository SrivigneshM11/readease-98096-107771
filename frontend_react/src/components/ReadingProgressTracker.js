import React, { useEffect, useState } from "react";

/**
 * Utils for date calculations and localStorage persistence
 */
function getTodayIso() {
  // Returns "YYYY-MM-DD" for today
  return new Date().toISOString().slice(0, 10);
}
function getWeekStartIso() {
  // Returns "YYYY-MM-DD" for Monday of current week
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday (0)
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}
function getLast7Days() {
  // Returns array of { date, label } for past 7 days
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      date: iso,
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return days;
}
function loadProgress() {
  try {
    const data = window.localStorage.getItem("readingProgress_v1");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}
function saveProgress(progress) {
  try {
    window.localStorage.setItem("readingProgress_v1", JSON.stringify(progress));
  } catch {
    // ignore
  }
}

/**
 * Save a read event (article completion) for today.
 * Optionally accepts a genre or article ID for future extensibility.
 */
export function recordReadingSession() {
  const progress = loadProgress();
  const today = getTodayIso();
  progress[today] = Number(progress[today] || 0) + 1; // One per article
  saveProgress(progress);
}

/**
 * PUBLIC_INTERFACE
 * ReadingProgressTracker displays user's daily and weekly reading progress (articles read),
 * using persistent localStorage data. Modern, minimal, and responsive.
 */
function ReadingProgressTracker() {
  // Internal state from localStorage
  const [progress, setProgress] = useState({});

  // On mount: fetch from localStorage, set up storage event listener for sync
  useEffect(() => {
    setProgress(loadProgress());

    // Listen for changes from other tabs (optional)
    function handleStorage(e) {
      if (e.key === "readingProgress_v1") {
        setProgress(e.newValue ? JSON.parse(e.newValue) : {});
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // When a read is recorded in this tab, update local state
  function refreshProgress() {
    setProgress(loadProgress());
  }

  // Progress calculations
  const today = getTodayIso();
  const weekStart = getWeekStartIso();
  const days = getLast7Days(); // [{ date, label }]
  let todayCount = Number(progress[today] || 0);
  let weekCount = 0;
  for (const [date, count] of Object.entries(progress)) {
    if (date >= weekStart) weekCount += Number(count);
  }

  // Daily goal
  const dailyGoal = 2;
  const weeklyGoal = 7;

  // For modern: horizontal "goal" bar, tick marks for days, minimal color/contrast
  return (
    <section
      aria-label="Reading Progress"
      style={{
        width: "100%",
        maxWidth: 440,
        margin: "22px auto 0 auto",
        padding: "18px 14px 22px 14px",
        background: "var(--bg-secondary)",
        borderRadius: 16,
        boxShadow: "0 1px 7px 0 rgba(70,110,180,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1.5px solid var(--border-color)",
      }}
    >
      {/* --- Title/summary --- */}
      <h3
        style={{
          margin: 0,
          fontSize: "1.21rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "0.01em",
        }}
      >
        Your Reading Progress
      </h3>
      <div
        style={{
          fontSize: "1.07rem",
          color: "var(--text-secondary)",
          marginTop: 3,
          marginBottom: 14,
          fontWeight: 500,
          letterSpacing: "0.008em",
        }}
      >
        {todayCount > 0
          ? `Articles read today: ${todayCount} / ${dailyGoal}`
          : "Read at least 1 article for today's streak!"}
      </div>
      {/* --- Daily bar --- */}
      <div
        style={{
          width: "90%",
          background: "linear-gradient(90deg, var(--text-secondary) 12%, var(--button-bg))",
          height: 14,
          borderRadius: 7,
          marginBottom: 14,
          overflow: "hidden",
          position: "relative",
        }}
        aria-label={`Today's goal progress: ${todayCount} of ${dailyGoal}`}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, (todayCount / dailyGoal) * 100)}%`,
            background: "linear-gradient(90deg, #36d1c4, #5b86e5 65%)",
            borderRadius: 7,
            transition: "width 0.2s cubic-bezier(.32,.72,.42,1.2)",
            boxShadow: "0 2px 10px 0 rgba(71,151,198,0.10)",
          }}
        />
        {/* Goal dot */}
        <div
          style={{
            position: "absolute",
            left: `${Math.min(100, (dailyGoal / dailyGoal) * 100) - 3}%`,
            top: 2,
            width: 10,
            height: 10,
            background: "#F7B731",
            borderRadius: "50%",
            boxShadow: "0 1px 3px #cbab3a5c",
          }}
        />
      </div>
      {/* --- Weekly overview --- */}
      <div style={{ width: "100%", marginTop: 4 }}>
        <div
          style={{
            fontSize: "1.02rem",
            color: "var(--text-secondary)",
            marginBottom: 6,
            textAlign: "left",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          Last 7 days
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: 2,
          }}
        >
          {days.map(({ date, label }) => (
            <div
              key={date}
              style={{
                textAlign: "center",
                flex: 1,
              }}
            >
              {/* Bar for each day */}
              <div
                style={{
                  height: 26,
                  background:
                    Number(progress[date] || 0) > 0
                      ? "linear-gradient(0deg, #F7B731 60%, #36D1C4 100%)"
                      : "var(--border-color)",
                  borderRadius: 6,
                  marginBottom: 2,
                  transition: "background 0.19s",
                  boxShadow:
                    Number(progress[date] || 0) > 0
                      ? "0 2px 5px 0 rgba(70,171,90,0.10)"
                      : "none",
                  opacity: Number(progress[date] || 0) > 0 ? 1 : 0.4,
                }}
                aria-label={
                  Number(progress[date] || 0) > 0
                    ? `${label}: read ${progress[date]}`
                    : `${label}: no articles read`
                }
                title={
                  Number(progress[date] || 0) > 0
                    ? `${progress[date]} read`
                    : "No articles"
                }
              ></div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  opacity: 0.74,
                }}
                aria-hidden="true"
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* --- Weekly summary --- */}
      <div
        style={{
          fontSize: "0.97rem",
          marginTop: 10,
          color: "var(--text-primary)",
          letterSpacing: "0.012em",
        }}
      >
        <span style={{ fontWeight: 600, color: "#5B86E5" }}>{weekCount}</span>
        {" "}articles this week&nbsp;
        <span style={{
          fontSize: "0.91em",
          color: weekCount >= weeklyGoal ? "#36D1C4" : "var(--text-secondary)"
        }}>
          {weekCount >= weeklyGoal
            ? "✅ Goal met!"
            : `/ ${weeklyGoal} weekly goal`}
        </span>
      </div>
      <button
        className="btn"
        aria-label="Refresh progress"
        style={{
          marginTop: 14,
          fontSize: "0.98rem",
          padding: "8px 18px",
          borderRadius: 7,
          background: "var(--button-bg)",
          color: "var(--button-text)",
        }}
        tabIndex={0}
        onClick={refreshProgress}
      >↻ Refresh</button>
    </section>
  );
}

export default ReadingProgressTracker;
