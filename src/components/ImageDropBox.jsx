import React, { useState } from "react";
import "../styles/components.css";

export default function ImageDropBox({ onImageSelected }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (onImageSelected) onImageSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        border: `2px dashed ${dragOver ? "#61dafb" : "rgba(255,255,255,0.3)"}`,
        borderRadius: "8px",
        padding: "30px",
        textAlign: "center",
        background: dragOver ? "rgba(97,218,251,0.05)" : "transparent",
        maxWidth: "500px",
        margin: "16px auto",
        cursor: "pointer",
      }}
    >
      <input
        type="file"
        accept="image/*"
        id="image-drop-input"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      <label htmlFor="image-drop-input" style={{ cursor: "pointer" }}>
        {previewUrl ? (
          <div>
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              style={{ maxHeight: "150px", borderRadius: "6px", marginBottom: "8px" }}
            />
            <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
              {selectedFile?.name} (Click or drag to change)
            </p>
          </div>
        ) : (
          <div>
            <p style={{ margin: "0 0 8px 0", color: "#fff" }}>
              Drop an image here or click to browse
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>
              Supports JPG, PNG, and WebP for pattern matching and visual analysis
            </p>
          </div>
        )}
      </label>
    </div>
  );
}
