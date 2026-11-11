import React from "react";
import "../styles/components.css";

export default function EarthView({ onSelectEarthTopic }) {
  const earthTopics = [
    { title: "Blue Marble", query: "earth blue marble", mission: "Apollo / Terra" },
    { title: "ISS Night Views", query: "earth iss night lights", mission: "ISS" },
    { title: "Atmosphere & Clouds", query: "earth atmosphere limb", mission: "MODIS" },
    { title: "Aurora Borealis", query: "earth aurora iss", mission: "ISS" },
    { title: "Landsat Surface", query: "earth landsat surface", mission: "Landsat" },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}>
      <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "15px" }}>
        Earth Observatory – Perspectives of our home planet from orbit, Landsat, and the International Space Station.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
        {earthTopics.map((item) => (
          <button
            key={item.title}
            type="button"
            className="chip"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            onClick={() => onSelectEarthTopic && onSelectEarthTopic(item.query)}
          >
            <strong>{item.title}</strong> <span style={{ color: "#61dafb", fontSize: "0.75rem" }}>({item.mission})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
