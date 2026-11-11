import React from "react";
import SearchBar from "../components/SearchBar";
import "../styles/components.css";

export default function ImageSearchPage({ onNavigate }) {
  return (
    <div className="star-background">
      <nav className="navbar">
        <span className="nav-item left" onClick={() => onNavigate && onNavigate("home")}>
          Blue shift
        </span>
        <div className="nav-right">
          <span className="nav-item" onClick={() => onNavigate && onNavigate("galaxy")}>
            galaxy
          </span>
          <span className="nav-item" onClick={() => onNavigate && onNavigate("solarsystem")}>
            Solar system
          </span>
          <span className="nav-item" onClick={() => onNavigate && onNavigate("earth")}>
            earth
          </span>
        </div>
      </nav>
      <div style={{ width: "100%", padding: "0 20px" }}>
        <SearchBar placeholder="Search stars, planets, nebulae, galaxies..." />
      </div>
    </div>
  );
}
