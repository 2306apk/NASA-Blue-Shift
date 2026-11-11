import React from "react";
import ReactModal from "react-modal";
import "./ImageModal.css";

if (typeof document !== "undefined" && document.getElementById("root")) {
  ReactModal.setAppElement("#root");
}

export default function DetailDialogue({ isOpen, onRequestClose, title, details }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="modal-content"
      overlayClassName="modal-overlay"
      style={{
        content: {
          maxWidth: "600px",
          height: "auto",
          maxHeight: "80vh",
          padding: "24px",
          color: "#e0e0e0",
          fontFamily: "'Courier New', Courier, monospace",
        },
      }}
    >
      <button className="modal-close" onClick={onRequestClose} aria-label="Close">
        &times;
      </button>
      <h2 style={{ color: "#fff", marginTop: 0 }}>{title || "Feature Details"}</h2>
      <div style={{ marginTop: "16px", lineHeight: "1.5", fontSize: "0.95rem" }}>
        {typeof details === "string" ? (
          <p>{details}</p>
        ) : (
          <pre style={{ whiteSpace: "pre-wrap", color: "#ccc" }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        )}
      </div>
    </ReactModal>
  );
}
