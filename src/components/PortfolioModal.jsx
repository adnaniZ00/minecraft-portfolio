export function PortfolioModal({ activeSection, onClose }) {
  if (!activeSection) return null;

  const sectionTitles = {
    about: "About Me",
    projects: "My Projects",
    contact: "Contact & Socials",
  };

  return (
    <div className="modal">
      <h2>{sectionTitles[activeSection] || "Section"}</h2>
      <p>Welcome to the {activeSection} section! Customize this modal with your content.</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
