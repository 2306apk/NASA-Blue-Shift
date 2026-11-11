import React from "react";

export default function ToggleSwitch({ label, checked, onChange }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: "8px", userSelect: "none" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
        style={{ cursor: "pointer" }}
      />
      <span style={{ color: "#e0e0e0", fontSize: "0.85rem" }}>{label}</span>
    </label>
  );
}
