import React, { useRef, useState } from "react";

/**
 * Extract plain text from JSX/HTML content for TTS.
 */
function extractTextFromJSX(node) {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (!node) return "";
  if (Array.isArray(node)) {
    return node.map(extractTextFromJSX).join(" ");
  }
  if (node.props && node.props.children) {
    return extractTextFromJSX(node.props.children);
  }
  return "";
}

// PUBLIC_INTERFACE
function ArticleView({ title, content, onNextArticle }) {
  /**
   * ArticleView: Displays an article with modern fonts, excellent spacing,
   * a "Read Aloud" button for accessibility, and "Next Article" button.
   * @param {string} title - The article headline/title.
   * @param {string|JSX.Element} content - The article body content.
   * @param {function} onNextArticle - Callback for loading the next article.
   */

  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);

  // Handler for TTS
  const handleReadAloud = () => {
    if (!synthRef.current) return;
    // If already speaking, stop
    if (synthRef.current.speaking || synthRef.current.pending) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }
    const toRead =
      (typeof title === "string" ? title + ". " : "") +
      extractTextFromJSX(content);
    if (!toRead.trim()) return;
    const utter = new window.SpeechSynthesisUtterance(toRead);
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    utter.rate = 1.02;
    utter.pitch = 1;
    utter.lang = window.navigator.language || "en-US";
    utteranceRef.current = utter;
    synthRef.current.speak(utter);
  };

  // Cancel speaking if article changes/unmounts
  React.useEffect(() => {
    setIsSpeaking(false);
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
    // eslint-disable-next-line
  }, [title, content]);

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
        id="article-content"
      >
        {content}
      </article>
      {/* --- TTS BUTTON --- */}
      <button
        type="button"
        aria-label={isSpeaking ? "Stop reading aloud" : "Read article aloud"}
        className="btn btn-large"
        style={{
          alignSelf: "center",
          background: isSpeaking
            ? "linear-gradient(90deg, #c94e4e, var(--button-bg))"
            : "linear-gradient(90deg, var(--text-secondary), var(--button-bg))",
          color: "var(--button-text)",
          fontSize: "1.06rem",
          fontWeight: 700,
          border: "none",
          borderRadius: 9,
          padding: "12px 32px",
          marginTop: "0px",
          marginBottom: "14px",
          letterSpacing: "0.03em",
          boxShadow: "0 2px 8px 0 rgba(70,120,140,0.09)",
          cursor: isSpeaking ? "pointer" : "pointer",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.11s",
        }}
        onClick={handleReadAloud}
        disabled={
          typeof window === "undefined" ||
          !window.speechSynthesis ||
          !window.SpeechSynthesisUtterance
        }
      >
        {isSpeaking ? (
          <>
            <span role="img" aria-label="Stop">🛑</span> Stop Reading
          </>
        ) : (
          <>
            <span role="img" aria-label="Read aloud">🔊</span> Read Aloud
          </>
        )}
      </button>
      {/* --- NEXT ARTICLE BUTTON --- */}
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
          marginTop: "7px",
          letterSpacing: "0.03em",
          boxShadow: "0 2px 8px 0 rgba(70,120,140,0.09)",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.11s",
        }}
        onClick={onNextArticle}
      >
        Next Article →
      </button>
      {/* Accessibility/help note */}
      <span
        style={{
          fontSize: "0.97rem",
          textAlign: "center",
          color: "var(--text-secondary)",
          marginTop: "20px",
          marginBottom: "-14px",
          display: "block",
          opacity: 0.82,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {typeof window !== "undefined" && window.speechSynthesis
          ? isSpeaking
            ? "Reading aloud... You can stop at any time."
            : "Click 'Read Aloud' to listen to this article. Your browser speaks the text."
          : "Text-to-Speech is not supported in this browser."}
      </span>
    </section>
  );
}

export default ArticleView;
