import React, { useState } from "react";
import ArticleView from "../components/ArticleView";

// PUBLIC_INTERFACE
function Article() {
  /**
   * Article reading page. Displays article using ArticleView.
   * Later, connect to fetch actual articles from backend/REST API.
   */
  // For demonstration, using static placeholder data and cycling between two fake articles
  const demoArticles = [
    {
      title: "The Wonders of Science: How Curiosity Shapes Our World",
      content: (
        <>
          <p>
            Science is not just a discipline but a way of thinking—one that encourages curiosity and discovery. From the earliest days, humans have gazed at the stars and wondered about their place in the universe. Today, science helps us answer age-old questions and invent new technologies that change our daily lives. Imagine the impact of electricity, computers, and vaccines—each a result of relentless curiosity.
          </p>
          <p>
            <b>Did you know?</b> Every time you ask ‘why’ or ‘how’, you are thinking like a scientist. Next time you notice something unusual, try researching it or asking a teacher why it happens. You might discover something wonderful!
          </p>
        </>
      ),
    },
    {
      title: "Healthy Habits: Small Steps, Big Changes",
      content: (
        <>
          <p>
            Building healthy habits isn’t about drastic changes—tiny improvements add up over time. Eating a piece of fruit, taking a walk, or getting enough sleep can make a big difference to your mind and body. Try setting a small goal each week, like choosing water over soda or reading before bed instead of using your phone.
          </p>
          <p>
            <b>Quick tip:</b> Make habits easier by putting reminders in places you see often. Consistency, not perfection, is what counts on your journey to health!
          </p>
        </>
      ),
    },
  ];

  const [articleIndex, setArticleIndex] = useState(0);

  // Simulate 'Next Article' cycling through demo list
  const handleNextArticle = () => {
    setArticleIndex((prevIdx) => (prevIdx + 1) % demoArticles.length);
  };

  return (
    <ArticleView
      title={demoArticles[articleIndex].title}
      content={demoArticles[articleIndex].content}
      onNextArticle={handleNextArticle}
    />
  );
}

export default Article;
