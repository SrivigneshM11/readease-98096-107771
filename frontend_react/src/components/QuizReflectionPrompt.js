import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * QuizReflectionPrompt displays a post-article quiz or reflection prompt.
 * It uses mock data, is fully accessible, and adapts to mobile/desktop screens.
 * Props:
 *   - quiz: { type: 'multiple-choice'|'reflection', question: string, options?: string[], answer?: number, explanation?: string }
 *   - onDone: function called when the prompt is completed or dismissed
 */
function QuizReflectionPrompt({ quiz, onDone }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  const isMC = quiz.type === "multiple-choice";
  const isReflection = quiz.type === "reflection";
  const ariaLabel =
    isMC
      ? `Quiz: ${quiz.question}`
      : `Reflection: ${quiz.question}`;

  function handleOptionSelect(idx) {
    if (!submitted) setSelected(idx);
  }
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }
  function handleFinish() {
    setSelected(null);
    setSubmitted(false);
    if (typeof onDone === "function") onDone();
  }

  return (
    <aside
      aria-label={ariaLabel}
      tabIndex={-1}
      style={{
        margin: "36px auto 0 auto",
        maxWidth: 540,
        width: "100%",
        background: "var(--bg-secondary)",
        border: "2.2px solid var(--border-color)",
        borderRadius: 16,
        boxShadow: "0 3px 18px 0 rgba(50,60,90,0.09)",
        padding: "30px 20px 19px 20px",
        color: "var(--text-primary)",
        fontFamily: "'Segoe UI','Roboto',sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        zIndex: 19,
      }}
    >
      <div style={{
        fontWeight: 700,
        fontSize: "1.22rem",
        marginBottom: 9,
        lineHeight: 1.29,
        color: "var(--text-primary)"
      }}>
        {isMC ? "Quick Quiz" : "Reflect & Recall"}
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ fontSize: "1.08rem", marginBottom: 20 }}>
          <span>{quiz.question}</span>
        </div>

        {isMC && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginBottom: 18,
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
            role="radiogroup"
            aria-label="Quiz Options"
          >
            {(quiz.options || []).map((opt, i) => (
              <li key={i}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background:
                      selected === i
                        ? submitted
                          ? (i === quiz.answer
                            ? "linear-gradient(90deg,#36D1C4,#5B86E5cc)"
                            : "#e1eaf3")
                          : "#e9ecef"
                        : "#f8f9fa",
                    borderRadius: 8,
                    padding: "10px 13px",
                    border: submitted && i === quiz.answer ? "2px solid #36D1C4" : "1.5px solid var(--border-color)",
                    color: "var(--text-primary)",
                    cursor: submitted ? "default" : "pointer",
                    fontWeight: 540,
                    fontSize: "1.04rem",
                  }}
                  tabIndex={0}
                  aria-checked={selected === i}
                  role="radio"
                  htmlFor={`quiz-opt-${i}`}
                >
                  <input
                    type="radio"
                    id={`quiz-opt-${i}`}
                    name="quiz"
                    value={i}
                    style={{ marginRight: 13 }}
                    checked={selected === i}
                    disabled={submitted}
                    onChange={() => handleOptionSelect(i)}
                    tabIndex={-1}
                    aria-label={opt}
                  />
                  {opt}
                  {submitted && i === quiz.answer && (
                    <span
                      aria-label="Correct Answer"
                      style={{
                        marginLeft: 10,
                        color: "#36D1C4",
                        fontWeight: 700,
                        fontSize: "0.99em",
                        display: "inline",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {submitted && selected === i && selected !== quiz.answer && (
                    <span
                      aria-label="Your Answer"
                      style={{
                        marginLeft: 10,
                        color: "#b00020",
                        fontWeight: 700,
                        fontSize: "0.99em",
                        display: "inline"
                      }}
                    >
                      ✗
                    </span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        )}

        {isReflection && (
          <div>
            <textarea
              aria-label="Write your reflection"
              style={{
                minHeight: 64,
                width: "100%",
                resize: "vertical",
                borderRadius: 8,
                border: "1.7px solid var(--border-color)",
                marginBottom: 12,
                padding: 9,
                fontSize: "1.07rem",
                color: "var(--text-primary)",
                background: "var(--bg-primary)"
              }}
              disabled={submitted}
              placeholder="Write a few thoughts or a quick summary here…"
              onChange={() => { }} // UI only, don't save
              tabIndex={0}
              required
            />
          </div>
        )}

        {!submitted && (
          <button
            type="submit"
            className="btn"
            style={{
              margin: "6px 0",
              fontWeight: 600,
              fontSize: "1.07rem",
              padding: "10px 28px",
              borderRadius: 7,
              alignSelf: "flex-start"
            }}
            disabled={isMC ? selected == null : false}
            aria-label="Submit answer"
          >
            Submit
          </button>
        )}

        {submitted && (
          <div>
            <div
              style={{
                padding: "8px 0",
                fontSize: "1rem",
                marginBottom: 8,
                color: isMC
                  ? (selected === quiz.answer ? "#36D1C4" : "#b00020")
                  : "var(--text-secondary)",
                fontWeight: 600
              }}
            >
              {isMC ? (
                selected === quiz.answer
                  ? "Correct! 🎉"
                  : "Not quite. Try again next time!"
              ) : (
                "Reflection saved (for demo)."
              )}
            </div>
            {quiz.explanation && (
              <div
                style={{
                  background: "#ecf7f6",
                  padding: "11px 16px",
                  borderRadius: 8,
                  color: "#333e44",
                  fontSize: "0.98em",
                  marginBottom: 10,
                }}
              >
                <strong>Explanation: </strong>
                {quiz.explanation}
              </div>
            )}
            <button
              type="button"
              className="btn"
              style={{
                fontSize: "0.99rem",
                marginTop: 5,
                padding: "9px 22px",
                borderRadius: 7
              }}
              aria-label="Finish quiz or reflection"
              onClick={handleFinish}
            >
              Done
            </button>
          </div>
        )}
      </form>
    </aside>
  );
}

export default QuizReflectionPrompt;
