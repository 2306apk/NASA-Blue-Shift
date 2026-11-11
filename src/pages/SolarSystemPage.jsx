import React from "react";
import SearchBar from "../components/SearchBar";
import SolarSystem from "../components/SolarSystem";
import "../styles/components.css";

export default function SolarSystemPage({ onNavigate }) {
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
          <span className="nav-item active" onClick={() => onNavigate && onNavigate("solarsystem")}>
            Solar system
          </span>
          <span className="nav-item" onClick={() => onNavigate && onNavigate("earth")}>
            earth
          </span>
        </div>
      </nav>
      <div style={{ width: "100%", padding: "0 20px" }}>
        <SolarSystem />
        <SearchBar placeholder="Search planets, moons, rovers..." defaultQuery="mars" />
      </div>
    </div>
  );
}
