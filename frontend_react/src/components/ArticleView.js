import React, { useRef, useState } from "react";
import WordDefineTooltip from "./WordDefineTooltip";
import { lookupWord } from "../services/dictionaryService";

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

  // TAP-TO-DEFINE STATE AND LOGIC
  const [defineWord, setDefineWord] = useState(null); // the word string
  const [defineRect, setDefineRect] = useState(null); // DOMRect of tapped element
  const [defineLoading, setDefineLoading] = useState(false);
  const [defineResult, setDefineResult] = useState("");
  const [defineError, setDefineError] = useState("");

  // Handler: On word click/tap/focus
  const handleWordClick = async (word, event) => {
    const rect = event.target.getBoundingClientRect();
    setDefineWord(word);
    setDefineRect(rect);
    setDefineLoading(true);
    setDefineResult("");
    setDefineError("");
    try {
      const result = await lookupWord(word);
      setDefineResult(result);
      setDefineError("");
    } catch (e) {
      setDefineResult("");
      setDefineError(e.message || "Error fetching definition.");
    } finally {
      setDefineLoading(false);
    }
  };

  const handleTooltipClose = () => {
    setDefineWord(null);
    setDefineRect(null);
    setDefineResult("");
    setDefineError("");
    setDefineLoading(false);
  };

  // Tokenize every word for tap-to-define, preserving formatting/links
  function renderContentWithTapToDefine(node) {
    if (typeof node === "string") {
      // Split string by word/whitespace/punct. E.g. "Hello, world!" → ["Hello", ",", " ", "world", "!"]
      const parts = node.match(/([A-Za-z'-]+|[^A-Za-z'-]|\\s+)/g) || [node];
      return parts.map((part, i) => {
        if (/^[A-Za-z'-]{2,}$/.test(part)) {
          return (
            <span
              key={`${part}-${i}`}
              role="button"
              tabIndex={0}
              aria-label={`Define "${part}"`}
              style={{
                color: "var(--text-secondary)",
                cursor: "pointer",
                borderBottom: "1px dotted var(--text-secondary)",
                background: defineWord === part ? "var(--bg-primary)" : "transparent",
                padding: "1px 2.5px",
                borderRadius: 4,
                transition: "background 0.11s"
              }}
              onClick={e => handleWordClick(part, e)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleWordClick(part, e);
                }
              }}
            >{part}</span>
          );
        }
        return <span key={`other-${i}`}>{part}</span>;
      });
    } else if (!node) {
      return null;
    } else if (Array.isArray(node)) {
      return node.map(renderContentWithTapToDefine);
    } else if (node.type === "a" && node.props && node.props.children) {
      // Special: preserve links
      return React.cloneElement(
        node,
        { ...node.props },
        renderContentWithTapToDefine(node.props.children)
      );
    } else if (node.props && node.props.children) {
      return React.cloneElement(
        node,
        { ...node.props },
        renderContentWithTapToDefine(node.props.children)
      );
    }
    return node;
  }
  // END TAP-TO-DEFINE

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
        position: "relative"
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
        aria-label="Article content (tap or click any word for a definition)"
      >
        {renderContentWithTapToDefine(content)}
      </article>
      {/* --- TAP-TO-DEFINE TOOTIP --- */}
      <WordDefineTooltip
        open={!!defineWord}
        word={defineWord}
        targetRect={defineRect}
        definition={defineResult}
        loading={defineLoading}
        error={defineError}
        onClose={handleTooltipClose}
      />
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
        <span>
        {typeof window !== "undefined" && window.speechSynthesis
          ? isSpeaking
            ? "Reading aloud... You can stop at any time."
            : "Click 'Read Aloud' to listen to this article. Your browser speaks the text."
          : "Text-to-Speech is not supported in this browser."}
        </span><br />
        <span style={{ fontSize: "0.90em", color: "var(--text-secondary)" }}>
          Tap or click <b>any word</b> for its dictionary definition.
        </span>
      </span>
    </section>
  );
}

export default ArticleView;
