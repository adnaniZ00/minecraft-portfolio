import { playSound } from "../utils/sound";
import { PROJECTS_DATA } from "../constants/projectsData";
import { CREDITS_DATA } from "../constants/creditsData";

export function PortfolioModal({ activeSection, onClose }) {
  if (!activeSection) return null;

  const sectionConfig = {
    about: {
      title: "Enchanting Table - About Me",
      icon: "✨",
      subtitle: "Web Developer & Full Stack Engineer",
      description:
        "Welcome, traveler! I am a web developer and I create interactive web experiences and scalable full-stack applications. Explore my portfolio to learn about my journey, skills, and creations.",
      // Replace with your actual Google Drive resume sharing link
      resumeUrl: "https://drive.google.com/file/d/11J7-Gcg-2IIYP6iNQGS6ItcL7oaVUUmE/view?usp=sharing",
      items: [
        { label: "Class", val: "Full Stack Engineer" },
        { label: "Enchantments", val: "React, Tailwindcss, Node.js, Postgresql, Firebase, HTML, CSS, Git, Github, Google cloud platform, Python, Javacript, and more" },
        { label: "XP Level", val: "Level 30 +" },
        {
          label: "Resume",
          val: "📄 Open Resume in Google Drive",
          url: "https://drive.google.com/file/d/11J7-Gcg-2IIYP6iNQGS6ItcL7oaVUUmE/view?usp=sharing",
        },
      ],
    },
    projects: {
      title: "Chest - Loot & Projects",
      icon: "📦",
      subtitle: "Discovered Artifacts & Repositories",
      description:
        "You opened the storage chest! Inside lies a curated stash of web apps, full-stack systems, and creations. Click on the action buttons below to inspect the code or test live demos.",
    },
    contact: {
      title: "Nether Portal - Interdimensional Comms",
      icon: "🔮",
      subtitle: "Portal to Socials & Contact",
      description:
        "Step through the obsidian gateway to connect! Whether you have an exciting project, freelance opportunity, or just want to chat Minecraft and code, send a message.",
      items: [
        { label: "Email", val: "adnan076234@gmail.com", url: "mailto:adnan076234@gmail.com" },
        { label: "GitHub", val: "https://github.com/adnaniZ00", url: "https://github.com/adnaniZ00" },
        { label: "Linkedin", val: "www.linkedin.com/in/mohd-adnan-khan-8791a2213", url: "https://www.linkedin.com/in/mohd-adnan-khan-8791a2213" },
      ],
    },
    credits: {
      title: "Credits & 3D Resources",
      icon: "📜",
      subtitle: "3D Model Creators & Licenses",
      description:
        "All 3D Minecraft models used in this world were sourced from Sketchfab under Creative Commons Attribution (CC-BY-4.0). Credits to their creators:",
    },
  };

  const current = sectionConfig[activeSection] || {
    title: "Interaction Menu",
    icon: "⛏️",
    subtitle: "Details",
    description: "Welcome to this section! Customize this menu with your content.",
    items: [],
  };

  const handleClose = () => {
    playSound("button", { volume: 0.5 });
    if (onClose) {
      onClose();
    }
  };

  const handleButtonClick = () => {
    playSound("button", { volume: 0.4 });
  };

  return (
    <div className="mc-modal-backdrop" onClick={handleClose}>
      <div
        className={`mc-gui-dialog ${activeSection === "projects" || activeSection === "credits" ? "mc-projects-dialog" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minecraft Window Header Bar */}
        <div className="mc-gui-header">
          <div className="mc-gui-title">
            <span className="mc-title-icon">{current.icon}</span>
            <span>{current.title}</span>
          </div>
          <button className="mc-gui-close" onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Content Box */}
        <div className="mc-gui-body">
          <div className="mc-subtitle">{current.subtitle}</div>
          <p className="mc-description">{current.description}</p>

          {/* If Projects Section: Render structured Minecraft Project Cards */}
          {activeSection === "projects" ? (
            <div className="mc-projects-list">
              {PROJECTS_DATA.map((proj, idx) => (
                <div key={proj.id || idx} className="mc-project-card">
                  <div className="mc-project-header">
                    <div className="mc-slot-box">
                      <span className="mc-slot-num">{idx + 1}</span>
                    </div>
                    <div className="mc-project-title-area">
                      <h4 className="mc-project-title">{proj.title}</h4>
                      {proj.tech && proj.tech.length > 0 && (
                        <div className="mc-project-tags">
                          {proj.tech.map((t, tIdx) => (
                            <span key={tIdx} className="mc-tech-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mc-project-desc">{proj.description}</p>

                  <div className="mc-project-links">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mc-link-btn mc-link-live"
                        onClick={handleButtonClick}
                      >
                        ⚡ Live Demo
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mc-link-btn mc-link-github"
                        onClick={handleButtonClick}
                      >
                        📦 GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : activeSection === "credits" ? (
            <div className="mc-projects-list">
              {CREDITS_DATA.map((credit, idx) => (
                <div key={credit.id || idx} className="mc-project-card">
                  <div className="mc-project-header">
                    <div className="mc-slot-box">
                      <span className="mc-slot-num">{idx + 1}</span>
                    </div>
                    <div className="mc-project-title-area">
                      <h4 className="mc-project-title">{credit.title}</h4>
                      <div className="mc-project-tags">
                        <span className="mc-tech-tag">{credit.role}</span>
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mc-tech-tag mc-license-tag"
                          onClick={handleButtonClick}
                        >
                          {credit.license}
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="mc-project-desc">
                    Created by{" "}
                    <a
                      href={credit.authorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mc-clickable-val"
                      onClick={handleButtonClick}
                    >
                      {credit.author}
                    </a>{" "}
                    on Sketchfab.
                  </p>

                  <div className="mc-project-links">
                    <a
                      href={credit.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mc-link-btn mc-link-live"
                      onClick={handleButtonClick}
                    >
                      🧊 View 3D Model
                    </a>
                    <a
                      href={credit.authorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mc-link-btn mc-link-github"
                      onClick={handleButtonClick}
                    >
                      👤 Creator Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Standard About / Contact Item Slots */
            current.items?.length > 0 && (
              <div className="mc-slot-grid">
                {current.items.map((it, idx) => (
                  <div key={idx} className="mc-slot-row">
                    <div className="mc-slot-box">
                      <span className="mc-slot-num">{idx + 1}</span>
                    </div>
                    <div className="mc-slot-info">
                      <span className="mc-slot-label">{it.label}:</span>
                      {it.url ? (
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mc-slot-val mc-clickable-val"
                          onClick={handleButtonClick}
                        >
                          {it.val}
                        </a>
                      ) : (
                        <span className="mc-slot-val">{it.val}</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Prominent Resume Button in About Me */}
                {activeSection === "about" && current.resumeUrl && (
                  <div className="mc-resume-action">
                    <a
                      href={current.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mc-link-btn mc-link-resume"
                      onClick={handleButtonClick}
                    >
                      📄 View & Download Resume (Google Drive) ⚡
                    </a>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Minecraft Footer Button */}
        <div className="mc-gui-footer">
          <button className="mc-btn mc-btn-large" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
