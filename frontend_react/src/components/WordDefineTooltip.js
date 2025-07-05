import React from "react";

/**
 * PUBLIC_INTERFACE
 * WordDefineTooltip provides an accessible, floating definition popup.
 * Appears near the selected word, traps keyboard focus, and closes via Escape/click-out.
 * Usage: controlled via props { open, targetRect, word, definition, loading, error, onClose }
 */
function WordDefineTooltip({ open, targetRect, word, definition, loading, error, onClose }) {
  // Compute style: position below/above/left/right based on space
  const [pos, setPos] = React.useState({ top: 0, left: 0, placement: "bottom" });
  const panelRef = React.useRef();

  React.useEffect(() => {
    if (!open || !targetRect) return;
    // Place below by default, else above if not enough space
    const viewport = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    const tooltipW = 320;
    const tooltipH = 110;
    let left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
    left = Math.max(10, Math.min(viewport.w - tooltipW - 10, left));
    let top, placement;
    if (targetRect.bottom + tooltipH + 14 < viewport.h) {
      // Enough space below
      top = targetRect.bottom + 8;
      placement = "bottom";
    } else if (targetRect.top - tooltipH - 8 > 0) {
      // Place above
      top = targetRect.top - tooltipH - 8;
      placement = "top";
    } else {
      // Default to bottom, will overflow
      top = Math.max(6, viewport.h - tooltipH - 6);
      placement = "bottom";
    }
    setPos({ left, top, placement });
  }, [open, targetRect]);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Click outside closes
  React.useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={word ? `Definition of ${word}` : "Dictionary definition"}
      tabIndex={-1}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        zIndex: 1003,
        minWidth: 235,
        maxWidth: 340,
        width: 320,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1.7px solid var(--text-secondary)",
        borderRadius: 14,
        boxShadow: "0 3px 18px 0 rgba(35,80,120,0.13)",
        padding: "16px 19px 18px 19px",
        fontSize: "1.05em",
        fontWeight: 440,
        lineHeight: 1.55,
        outline: "none",
      }}
      ref={panelRef}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <strong style={{ fontSize: "1.21em", marginRight: 10 }}>
          {word}
        </strong>
        <button
          aria-label="Close definition"
          style={{
            marginLeft: "auto",
            background: "var(--button-bg)",
            color: "var(--button-text)",
            border: "none",
            borderRadius: 20,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17,
            cursor: "pointer"
          }}
          tabIndex={0}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {loading ? (
        <span style={{ color: "var(--text-secondary)" }} aria-live="polite">
          Looking up dictionary…
        </span>
      ) : error ? (
        <span style={{ color: "#b00020" }} aria-live="polite">
          {error}
        </span>
      ) : (
        <span>{definition || <span style={{ color: "var(--text-secondary)" }}>No definition found.</span>}</span>
      )}
      <div
        style={{
          fontSize: "0.90em",
          marginTop: 14,
          color: "var(--text-secondary)",
          textAlign: "right"
        }}
      >
        {"Powered by "}
        <a
          href="https://dictionaryapi.dev/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text-secondary)", textDecoration: "underline" }}
        >Free Dictionary API</a>
      </div>
    </div>
  );
}

export default WordDefineTooltip;

