import React from "react";
import "../styles/components.css";

export default function SolarSystem({ onSelectBody }) {
  const bodies = [
    { name: "Sun", query: "sun solar flare", type: "Star" },
    { name: "Mercury", query: "mercury messenger", type: "Terrestrial" },
    { name: "Venus", query: "venus magellan", type: "Terrestrial" },
    { name: "Earth", query: "earth blue marble", type: "Terrestrial" },
    { name: "Moon", query: "moon apollo lunar", type: "Satellite" },
    { name: "Mars", query: "mars curiosity perseverance", type: "Terrestrial" },
    { name: "Jupiter", query: "jupiter juno great red spot", type: "Gas Giant" },
    { name: "Saturn", query: "saturn cassini rings", type: "Gas Giant" },
    { name: "Uranus", query: "uranus voyager", type: "Ice Giant" },
    { name: "Neptune", query: "neptune voyager", type: "Ice Giant" },
    { name: "Pluto", query: "pluto new horizons", type: "Dwarf Planet" },
  ];

  return (
    <div style={{ maxWidth: "860px", margin: "20px auto", textAlign: "center" }}>
      <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "15px" }}>
        Solar System Explorer – Direct access to NASA probe and satellite imagery across our planetary neighborhood.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
        {bodies.map((b) => (
          <button
            key={b.name}
            type="button"
            className="chip"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            onClick={() => onSelectBody && onSelectBody(b.query)}
          >
            <strong>{b.name}</strong> <span style={{ color: "#61dafb", fontSize: "0.75rem" }}>[{b.type}]</span>
          </button>
        ))}
      </div>
    </div>
  );
}
