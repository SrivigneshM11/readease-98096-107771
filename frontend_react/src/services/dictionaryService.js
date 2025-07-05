const CACHE = {};

/**
 * PUBLIC_INTERFACE
 * Looks up the definition of a word using Free Dictionary API, caches for session.
 * Falls back to a small set of mock definitions if the API fails.
 * @param {string} word
 * @returns {Promise<string>} - A definition string (short) or error string
 */
export async function lookupWord(word) {
  if (!word || typeof word !== "string" || !/^[A-Za-z-]{2,}$/.test(word)) {
    throw new Error("Invalid word.");
  }
  const lower = word.toLowerCase();
  if (CACHE[lower]) return CACHE[lower];
  // Official: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
  try {
    const resp = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lower)}`
    );
    if (!resp.ok) throw new Error("Not found");
    const data = await resp.json();
    if (Array.isArray(data) && data.length && data[0].meanings && data[0].meanings.length) {
      // Grab first definition (simplest)
      let meaningObj = data[0].meanings[0];
      if (meaningObj.definitions && meaningObj.definitions.length) {
        const def = meaningObj.definitions[0].definition;
        CACHE[lower] = def;
        return def;
      }
    }
    throw new Error("No definition found.");
  } catch {
    // Fallback mock data
    const basicMock = {
      perseverance: "Persistence in doing something despite difficulty.",
      serendipity: "A fortunate discovery made by accident.",
      ephemeral: "Lasting for a very short time.",
      catalyst: "A person or thing that precipitates an event.",
      nostalgia: "A sentimental longing for the past.",
      ubiquitous: "Present, appearing, or found everywhere.",
      paradigm: "A typical example or pattern of something.",
      ameliorate: "To make something better or improve it.",
      benevolent: "Well meaning and kindly.",
      robust: "Strong and healthy; vigorous.",
      resilience: "The ability to recover from setbacks.",
      eloquent: "Fluent or persuasive in speaking or writing.",
      emulate: "Match or surpass, typically by imitation.",
      enigmatic: "Difficult to interpret or understand; mysterious.",
      prolific: "Present in large numbers or quantities; plentiful.",
    };
    if (basicMock[lower]) return basicMock[lower];
    throw new Error("Definition not found (API unavailable)");
  }
}

