import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleView from "../components/ArticleView";

// Simple mock articles for each genre
const genreArticles = {
  Sports: [
    {
      title: "Playing Together: The Joy of Team Sports",
      content: (
        <>
          <p>
            Sports bring people together and teach the value of teamwork. Whether it’s scoring a goal in soccer or making a great pass in basketball, each moment is special. Working together helps you not only win games but also make new friends.
          </p>
          <p>
            <b>Did you know?</b> Playing sports is great for your health. Try joining a local team or just play for fun in your yard—you’ll always learn something new!
          </p>
        </>
      ),
    },
    {
      title: "Sportsmanship: Winning and Losing With Grace",
      content: (
        <>
          <p>
            Winning feels good, but learning to play fair and respect others makes you a true champion. Even when you lose, you gain skills and friendships that last.
          </p>
          <p>
            <b>Tip:</b> Cheer for your teammates and thank your opponents. That’s the spirit of sports!
          </p>
        </>
      ),
    },
  ],
  Science: [
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
      title: "Amazing Inventions: Science Changes Lives",
      content: (
        <>
          <p>
            The light bulb, the telephone, and the airplane—all came from scientific thinking. Inventors solve big problems by observing, questioning, and experimenting.
          </p>
          <p>
            <b>Fun fact:</b> What’s something in your room that was invented thanks to science?
          </p>
        </>
      ),
    },
  ],
  Technology: [
    {
      title: "Tech in Everyday Life: Tools That Help Us Learn",
      content: (
        <>
          <p>
            Technology is everywhere! From your smartphone to your school’s computers, these inventions make life exciting and give you access to new information.
          </p>
          <p>
            <b>Try this:</b> List three ways you use technology for learning each day!
          </p>
        </>
      ),
    },
    {
      title: "From Imagination to Innovation",
      content: (
        <>
          <p>
            Someone once dreamed up the idea of video calls. Today, we use them to talk to friends far away. Every piece of technology starts with a creative idea.
          </p>
          <p>
            <b>Imagine:</b> What’s a new gadget you wish someone would invent?
          </p>
        </>
      ),
    },
  ],
  Films: [
    {
      title: "Movies: Stories That Come to Life",
      content: (
        <>
          <p>
            Watching a movie is like jumping into a new world! Films use actors, music, and animation to make stories exciting and real.
          </p>
          <p>
            <b>Idea:</b> After your next movie, talk with someone about your favorite scene!
          </p>
        </>
      ),
    },
    {
      title: "Making Magic: How Films Are Created",
      content: (
        <>
          <p>
            It takes writers, directors, actors, and artists to make a movie. Each person adds a little magic to the final story.
          </p>
          <p>
            <b>Think about:</b> If you made a film, what story would you tell?
          </p>
        </>
      ),
    },
  ],
  History: [
    {
      title: "Why History Matters: Learning from the Past",
      content: (
        <>
          <p>
            History helps us understand how people lived, what they believed, and how the world changed over time. From ancient pyramids to space travel, every event adds to our story.
          </p>
          <p>
            <b>Challenge:</b> Ask someone in your family about a historical event they remember!
          </p>
        </>
      ),
    },
    {
      title: "Great Leaders Who Changed the World",
      content: (
        <>
          <p>
            Some leaders inspired people with their actions and ideas. They show us that one person can make a difference!
          </p>
          <p>
            <b>Reflection:</b> Who’s a leader from history you admire?
          </p>
        </>
      ),
    },
  ],
  Health: [
    {
      title: "Healthy Habits: Small Steps, Big Changes",
      content: (
        <>
          <p>
            Building healthy habits isn’t about drastic changes—tiny improvements add up over time. Eating a piece of fruit, taking a walk, or getting enough sleep can make a big difference to your mind and body.
          </p>
          <p>
            <b>Quick tip:</b> Make habits easier by putting reminders in places you see often. Consistency, not perfection, is what counts on your journey to health!
          </p>
        </>
      ),
    },
    {
      title: "Stay Active: Moving Your Body Every Day",
      content: (
        <>
          <p>
            Moving helps your muscles grow strong and keeps your mind clear. Try a dance, a stretch, or a few jumping jacks each day!
          </p>
          <p>
            <b>Goal:</b> What new activity will you try this week?
          </p>
        </>
      ),
    },
  ],
  Literature: [
    {
      title: "Books: Portals to Imagination",
      content: (
        <>
          <p>
            Reading stories lets you travel anywhere—another country, a magical land, even the future! Literature expands your mind and builds empathy with different characters.
          </p>
          <p>
            <b>Suggestion:</b> Pick a new book and share what you liked about it with a friend!
          </p>
        </>
      ),
    },
    {
      title: "Writing Your Own Story",
      content: (
        <>
          <p>
            Every author starts with a single idea. Try writing a poem or a short story. Use your imagination to create something new!
          </p>
          <p>
            <b>Prompt:</b> If you could write a story about anything, what would you choose?
          </p>
        </>
      ),
    },
  ],
};

// PUBLIC_INTERFACE
function Article() {
  /**
   * Article reading page. Displays article relevant to the selected genre.
   * Accepts the genre via React Router navigation state.
   */
  const location = useLocation();
  const navigate = useNavigate();

  // Accept genre parameter via navigation state (from GenreGrid)
  const genre =
    location.state && location.state.genre
      ? location.state.genre
      : null;

  // If no genre passed, default to Science
  const displayGenre = genreArticles[genre] ? genre : "Science";

  // For navigation, display message and prompt to go Home if genre not known
  const showError =
    !genre || !genreArticles[displayGenre];

  // Cycling between two example articles for each genre
  const [articleIdx, setArticleIdx] = useState(0);

  const handleNextArticle = () => {
    setArticleIdx(
      (prevIdx) =>
        (prevIdx + 1) % genreArticles[displayGenre].length
    );
  };

  if (showError) {
    return (
      <section style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
        <h2>Genre not selected</h2>
        <p>
          Please return to the <b>Home</b> page and select a genre to read a relevant article.
        </p>
        <button
          className="btn"
          style={{ marginTop: 22 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </section>
    );
  }

  const article = genreArticles[displayGenre][articleIdx];

  return (
    <ArticleView
      title={article.title}
      content={article.content}
      onNextArticle={handleNextArticle}
    />
  );
}

export default Article;
