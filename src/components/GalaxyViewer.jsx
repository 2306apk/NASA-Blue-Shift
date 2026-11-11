import React from "react";
import "../styles/components.css";

export default function GalaxyViewer({ onSelectTarget }) {
  const galaxies = [
    { name: "Milky Way Center", query: "milky way center", tag: "Sagittarius A*" },
    { name: "Andromeda Galaxy", query: "andromeda galaxy", tag: "M31" },
    { name: "Sombrero Galaxy", query: "sombrero galaxy", tag: "M104" },
    { name: "Whirlpool Galaxy", query: "whirlpool galaxy", tag: "M51" },
    { name: "Hubble Deep Field", query: "hubble ultra deep field", tag: "Deep Space" },
    { name: "Carina Nebula", query: "carina nebula", tag: "JWST Target" },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}>
      <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "15px" }}>
        Galactic Gateway 2D Deep Space Explorer – Explore celestial targets from Hubble, Spitzer, and James Webb Space Telescope.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
        {galaxies.map((g) => (
          <button
            key={g.name}
            type="button"
            className="chip"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            onClick={() => onSelectTarget && onSelectTarget(g.query)}
          >
            <strong>{g.name}</strong> <span style={{ color: "#61dafb", fontSize: "0.75rem" }}>({g.tag})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
