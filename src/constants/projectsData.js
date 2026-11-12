/**
 * PROJECTS LIST CONFIGURATION
 * 
 * You can add, remove, or edit projects here easily!
 * Template fields:
 * - id: unique identifier / slot number
 * - title: Name of your project
 * - description: Brief description of what it is
 * - tech: Technologies/frameworks used
 * - liveUrl: Live website / demo link (leave empty "" if none)
 * - githubUrl: GitHub repository link (leave empty "" if none)
 */
export const PROJECTS_DATA = [
 {
    id: 1,
    title: "MAK Fit",
    description:
      "A personalized workout generator that creates workout plans based on selected muscle groups, workout splits, and fitness goals. Generates structured exercises tailored to individual training preferences.",
    tech: [
      "React.js",
      "JavaScript",
      "Vite",
      "Tailwind CSS"
    ],
    liveUrl: "https://mak-fit.netlify.app/",
    githubUrl: "https://github.com/adnaniZ00/Gym-App"
  },
  {
    id: 2,
    title: "MAK Pokédex",
    description:
      "An interactive Pokédex application that allows users to explore and search Pokémon. Displays detailed information, including Pokémon types, abilities, moves, images, and base stats using the PokéAPI.",
    tech: [
      "React.js",
      "JavaScript",
      "Vite",
      "CSS",
      "PokéAPI",
      "Local Storage"
    ],
    liveUrl: "https://mak-pokedex.netlify.app/",
    githubUrl: "https://github.com/adnaniZ00/pokedex"
  },
  {
    id: 3,
    title: "AI Blog Generator",
    description:
      "An AI-powered blog generation platform that converts YouTube video transcripts into structured blog articles using Google Gemini AI. Features automatic title generation, user authentication, and the ability to save and manage generated blog posts.",
    tech: [
      "Python",
      "Django",
      "PostgreSQL",
      "Google Gemini API",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Tailwind CSS",
      "Render"
    ],
    liveUrl: "https://ai-blog-app-i2aq.onrender.com/",
    githubUrl: "https://github.com/adnaniZ00/AI_Blog_App"
  },
  // Template for adding more projects:
  // {
  //   id: 4,
  //   title: "Project Four Title",
  //   description: "Description of your fourth project.",
  //   tech: ["Tech 1", "Tech 2"],
  //   liveUrl: "https://...",
  //   githubUrl: "https://...",
  // },
];

