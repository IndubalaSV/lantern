import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";

// Import meme images
import meme1 from "./assets/053ea938ded8ed7acb9c437a2a2ccfcf.jpg";
import meme2 from "./assets/186de3c3517bc8ecca286ad09dd0bb48.jpg";
import meme3 from "./assets/1a56517cc7fa98c0e4b1dfd75c84f5a4.jpg";
import meme4 from "./assets/1b06bb3c157f203ead006d8bd9d2c61f.jpg";
import meme5 from "./assets/27378ce60094c386ee0d59d747febd72.jpg";
import meme6 from "./assets/279f701eb9ec5f17bddc5bf488745baa.jpg";
import meme7 from "./assets/2e3257abb7c195d1b518e93c26181dcb.jpg";
import meme8 from "./assets/504968524da2be54c66ecf846b583e18.jpg";
import meme9 from "./assets/5bc3714391781c40334d4e7e1fa19d8d.jpg";
import meme10 from "./assets/5d4d278b085f3866625eec0e6c6be9fe.jpg";
import meme11 from "./assets/6f20d2d6abb3437de9719f19472bc104.jpg";
import meme12 from "./assets/805acb395da5c4b4448723f7fb5033d9.jpg";
import meme13 from "./assets/a515c5dc1c9731060e82030d7b5d16ad.jpg";
import meme14 from "./assets/c446e5cba4f1084ed80f97c4057d3150.jpg";
import meme15 from "./assets/d07dfee28b69aa9f4f6f40c028f5c481.jpg";
import meme16 from "./assets/d933f03aa2fbf373b2eb3ac5d46c1552.jpg";
import meme17 from "./assets/e0d6621317e9166803daade52edc5f5b.jpg";
import meme18 from "./assets/e27407ef96d32286fbe0194739efbdf9.jpg";
import meme19 from "./assets/e43bee6519961ef435bcd1f7309c8fa8.jpg";
import meme20 from "./assets/eada188d81520ed77cdb77d73d3e3eb4.jpg";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Default Literary Pep-Talk Cards Data (fallback)
const defaultLiteraryCards = [
  {
    title: "The Fellowship's Detour (The Lord of the Rings – J.R.R. Tolkien)",
    story:
      "In the wild lands of Middle-earth, the Fellowship didn't walk in a straight line to Mordor. They took wrong turns, lost members, and nearly froze in the snow. But every detour taught them who they really were.",
    lesson:
      "A loss isn't the end — it's just the chapter before your biggest victory.",
  },
  {
    title: "The Phoenix's Patience (Harry Potter – J.K. Rowling)",
    story:
      "Fawkes the Phoenix doesn't fear death because he knows something we often forget. Every ending is just a new beginning in disguise. He burns bright, turns to ash, and rises again stronger.",
    lesson: "Your lowest moment is just the fuel for your greatest comeback.",
  },
  {
    title: "The Mockingbird's Song (To Kill a Mockingbird – Harper Lee)",
    story:
      "Atticus told his children that mockingbirds only sing beautiful songs and harm no one. Yet the world tried to silence them anyway. But Scout learned that true courage isn't a man with a gun—it's continuing to sing when the world wants you quiet.",
    lesson: "Your voice matters most when others try to silence it.",
  },
  {
    title: "The Green Light's Promise (The Great Gatsby – F. Scott Fitzgerald)",
    story:
      "Gatsby stared at that green light across the bay every night, believing in tomorrow's possibilities. Though his dream was flawed, his hope was pure. He never stopped believing that the past could be rewritten.",
    lesson: "Hope is not naive—it's the most courageous thing you can choose.",
  },
  {
    title: "The Turtle's Wisdom (The Grapes of Wrath – John Steinbeck)",
    story:
      "A turtle crosses a dusty road, slow and determined. Cars swerve to hit it, but it pulls into its shell and keeps going. When it finally reaches the other side, seeds from its journey have scattered, ready to grow.",
    lesson:
      "Persistence plants seeds you'll never see, but the world will bloom because of them.",
  },
  {
    title: "The White Whale's Teaching (Moby Dick – Herman Melville)",
    story:
      "Captain Ahab chased his white whale across endless oceans, letting obsession consume him. But Ishmael, the storyteller, learned that sometimes the real journey isn't about catching what you're chasing—it's about who you become while chasing it.",
    lesson: "The pursuit changes you more than the prize ever could.",
  },
];

// Default Mood Recipe Data (fallback)
const defaultMoodRecipes = [
  {
    mood: "Feeling Low",
    recipe: "Warm soup with fresh bread",
    description:
      "Let the steam warm your face while you tear the bread with your hands. Comfort lives in simple rituals.",
  },
  {
    mood: "Anxious Energy",
    recipe: "Crunchy apples with sharp cheddar",
    description:
      "The satisfying crunch gives your nervous energy somewhere to go. Each bite grounds you back to the present.",
  },
];

// Default Weather Report Data (fallback)
const defaultWeatherReports = [
  "Today's forecast: Light fog with possible bursts of joy. High chance of surviving.",
  "Current conditions: Partly cloudy thoughts with scattered moments of clarity. Expect sunshine by evening.",
];

// Meme images array
const memeImages = [
  meme1,
  meme2,
  meme3,
  meme4,
  meme5,
  meme6,
  meme7,
  meme8,
  meme9,
  meme10,
  meme11,
  meme12,
  meme13,
  meme14,
  meme15,
  meme16,
  meme17,
  meme18,
  meme19,
  meme20,
];

// Gemini API functions
const generatePersonalizedContent = async (dayDescription) => {
  // Check if API key is available
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.error(
      "Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file"
    );
    return {
      literaryCards: defaultLiteraryCards,
      moodRecipes: defaultMoodRecipes,
      weatherReport:
        "Please add your Gemini API key to generate personalized content.",
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate Literary Cards
    const literaryPrompt = `Based on this person's day: "${dayDescription}", create 6 personalized literary wisdom cards. Each should have:
    - A title in format "Story Title (Book – Author)"
    - A 2-3 sentence story/parable from literature that relates to their day
    - A "Lesson:" that applies to their situation
    
    Return as valid JSON array with objects having: title, story, lesson
    
    Example format:
    [
      {
        "title": "Example Title (Book – Author)",
        "story": "A short story here.",
        "lesson": "The lesson learned."
      }
    ]`;

    const literaryResult = await model.generateContent(literaryPrompt);
    const literaryText = literaryResult.response.text();

    // Generate Mood Recipes
    const recipePrompt = `Based on this person's day: "${dayDescription}", create 3 personalized mood recipes. Each should suggest food that matches their emotional state with:
    - mood: describing their feeling
    - recipe: specific food/drink suggestion
    - description: poetic 1-2 sentence description of why this food helps
    
    Return as valid JSON array with objects having: mood, recipe, description
    
    Example format:
    [
      {
        "mood": "Feeling tired",
        "recipe": "Green tea with honey",
        "description": "The gentle caffeine awakens while honey soothes."
      }
    ]`;

    const recipeResult = await model.generateContent(recipePrompt);
    const recipeText = recipeResult.response.text();

    // Generate Weather Report
    const weatherPrompt = `Based on this person's day: "${dayDescription}", create ONE personalized emotional weather report that metaphorically describes their current mental/emotional state like a weather forecast. Make it encouraging, poetic, and specific to their situation. It should be 1-2 sentences that capture their emotional climate.
    
    IMPORTANT: Return ONLY the weather forecast text starting with "Today's emotional forecast is:" - do NOT include or reference the original input text.
    
    Example format: "Today's emotional forecast is: Sunny skies with gentle winds of hope, bringing clarity and renewed energy for the journey ahead."`;

    const weatherResult = await model.generateContent(weatherPrompt);
    const weatherText = weatherResult.response.text();

    // Parse JSON responses (with error handling)
    let literaryCards, moodRecipes, weatherReport;

    try {
      const cleanLiteraryText = literaryText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      literaryCards = JSON.parse(cleanLiteraryText);
    } catch (parseError) {
      console.error("Failed to parse literary cards:", parseError);

      literaryCards = defaultLiteraryCards;
    }

    try {
      const cleanRecipeText = recipeText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      moodRecipes = JSON.parse(cleanRecipeText);
    } catch (parseError) {
      console.error("Failed to parse mood recipes:", parseError);

      moodRecipes = defaultMoodRecipes;
    }

    // Weather report is just text, no JSON parsing needed
    weatherReport =
      weatherText.trim().replace(/```\n?|\n?```/g, "") ||
      defaultWeatherReports[0];

    return { literaryCards, moodRecipes, weatherReport };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      literaryCards: defaultLiteraryCards,
      moodRecipes: defaultMoodRecipes,
      weatherReport: defaultWeatherReports[0],
    };
  }
};

// Day Input Form Component
const DayInputForm = ({ onSubmit, isLoading }) => {
  const [dayDescription, setDayDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dayDescription.trim()) {
      onSubmit(dayDescription);
    }
  };

  return (
    <section className="day-input-section">
      <div className="day-input-container">
        <h2 className="section-title">How Was Your Day?</h2>
        <p className="day-input-description">
          Share how your day went, and I'll create personalized wisdom cards,
          mood recipes, and emotional weather reports just for you.
        </p>
        <form onSubmit={handleSubmit} className="day-input-form">
          <textarea
            value={dayDescription}
            onChange={(e) => setDayDescription(e.target.value)}
            placeholder="Tell me about your day... Was it challenging? Joyful? Overwhelming? Share whatever feels right..."
            className="day-input-textarea"
            rows={4}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="day-input-submit"
            disabled={isLoading || !dayDescription.trim()}
          >
            {isLoading
              ? "Creating Your Personal Wisdom..."
              : "Generate My Wisdom Cards ✨"}
          </button>
        </form>
      </div>
    </section>
  );
};

// Literary Card Component
const LiteraryCard = ({ card, index }) => (
  <div className="literary-card" style={{ "--delay": `${index * 0.1}s` }}>
    <h3 className="card-title">{card.title}</h3>
    <p className="card-story">{card.story}</p>
    <p className="card-lesson">
      <strong>Lesson:</strong> {card.lesson}
    </p>
  </div>
);

// Mood Recipe Component
const MoodRecipe = ({ recipe }) => (
  <div className="feature-card recipe-card">
    <h4 className="recipe-mood">{recipe.mood}?</h4>
    <h3 className="recipe-food">Try {recipe.recipe}</h3>
    <p className="recipe-description">{recipe.description}</p>
  </div>
);

// Weather Report Component
const WeatherReport = ({ currentWeatherReport }) => {
  const getWeatherIcon = () => {
    const report = currentWeatherReport.toLowerCase();
    if (
      report.includes("sun") ||
      report.includes("clear") ||
      report.includes("bright")
    )
      return "☀️";
    if (
      report.includes("cloud") ||
      report.includes("fog") ||
      report.includes("mist")
    )
      return "⛅";
    if (
      report.includes("rain") ||
      report.includes("storm") ||
      report.includes("pour")
    )
      return "🌧️";
    if (report.includes("thunder") || report.includes("lightning")) return "⛈️";
    return "🌤️";
  };

  return (
    <div className="feature-card weather-card">
      <h3 className="feature-title">
        {getWeatherIcon()} Your Personal Weather Report
      </h3>
      <p className="weather-report">{currentWeatherReport}</p>
    </div>
  );
};

// Meme Gallery Component with flip functionality
const MemeGallery = () => {
  const [flippedCards, setFlippedCards] = useState(new Set());

  const handleCardClick = (index) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="meme-gallery">
      <h2 className="section-title">Comic Relief for the Soul</h2>
      <p className="meme-gallery-description">
        Click the cards to reveal some humor for your day!
      </p>
      <div className="meme-grid">
        {memeImages.map((image, index) => (
          <div
            key={index}
            className={`meme-card ${flippedCards.has(index) ? "flipped" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="meme-card-inner">
              <div className="meme-card-front">
                <div className="meme-card-placeholder">
                  <span>Click for a smile! 😊</span>
                </div>
              </div>
              <div className="meme-card-back">
                <img
                  src={image}
                  alt={`Inspirational meme ${index + 1}`}
                  className="meme-image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [literaryCards, setLiteraryCards] = useState(defaultLiteraryCards);
  const [moodRecipes, setMoodRecipes] = useState(defaultMoodRecipes);
  const [weatherReport, setWeatherReport] = useState(defaultWeatherReports[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);

  const handleDaySubmit = async (dayDescription) => {
    setIsLoading(true);
    setHasGeneratedContent(false);

    try {
      const personalizedContent = await generatePersonalizedContent(
        dayDescription
      );

      setLiteraryCards(personalizedContent.literaryCards);
      setMoodRecipes(personalizedContent.moodRecipes);
      setWeatherReport(personalizedContent.weatherReport);
      setHasGeneratedContent(true);
    } catch (error) {
      console.error("Error generating personalized content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Day Input Form */}
      <DayInputForm onSubmit={handleDaySubmit} isLoading={isLoading} />

      <hr className="section-separator" />

      {/* Section 1: Literary Pep-Talk Cards */}
      <section className="literary-section">
        <h1 className="main-title">
          {hasGeneratedContent
            ? "Your Personal Wisdom"
            : "Literary Wisdom for Life's Journey"}
        </h1>
        <div className="literary-cards">
          {literaryCards.map((card, index) => (
            <LiteraryCard key={index} card={card} index={index} />
          ))}
        </div>
      </section>

      <hr className="section-separator" />

      {/* Section 2: Feature Cards */}
      <section className="features-section">
        <div className="mood-recipes">
          <h3 className="feature-group-title">🍯 Mood Recipes</h3>
          <div className="recipe-grid">
            {moodRecipes.map((recipe, index) => (
              <MoodRecipe key={index} recipe={recipe} />
            ))}
          </div>
        </div>

        <WeatherReport currentWeatherReport={weatherReport} />
      </section>

      <hr className="section-separator" />

      {/* Section 3: Meme Gallery */}
      <section className="meme-section">
        <MemeGallery />
      </section>
    </div>
  );
}

export default App;
