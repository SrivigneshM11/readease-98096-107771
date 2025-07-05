import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Article from './pages/Article';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {/* Navigation: could be styled further as needed */}
          <nav style={{ margin: '18px 0' }}>
            <Link style={{ marginRight: '20px', color: "var(--text-primary)", fontWeight: 600 }} to="/">
              Home
            </Link>
            <Link style={{ color: "var(--text-primary)", fontWeight: 600 }} to="/article">
              Article
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article" element={<Article />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
