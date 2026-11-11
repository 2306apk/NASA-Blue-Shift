import React, { useState } from "react";
import ReactModal from "react-modal";
import "./ImageModal.css";

if (typeof document !== "undefined" && document.getElementById("root")) {
  ReactModal.setAppElement("#root");
}

const QUIZ_QUESTIONS = [
  {
    question: "What spacecraft provided the highest resolution images of Pluto in 2015?",
    options: ["Voyager 1", "New Horizons", "Cassini", "Curiosity"],
    answer: 1,
  },
  {
    question: "Which planet in our solar system has the most prominent ring system?",
    options: ["Jupiter", "Uranus", "Neptune", "Saturn"],
    answer: 3,
  },
  {
    question: "Which NASA space observatory captured the Pillars of Creation in infrared?",
    options: ["James Webb Space Telescope", "Chandra", "Spitzer", "Kepler"],
    answer: 0,
  },
];

export default function QuizPopup({ isOpen, onRequestClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="modal-content"
      overlayClassName="modal-overlay"
      style={{
        content: {
          maxWidth: "500px",
          height: "auto",
          padding: "24px",
          color: "#e0e0e0",
          fontFamily: "'Courier New', Courier, monospace",
        },
      }}
    >
      <button className="modal-close" onClick={onRequestClose} aria-label="Close">
        &times;
      </button>

      <h2 style={{ color: "#61dafb", marginTop: 0 }}>Cosmic Knowledge Quiz</h2>

      {!showResult ? (
        <div>
          <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </p>
          <p style={{ fontSize: "1rem", fontWeight: "bold", margin: "16px 0" }}>
            {currentQ.question}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {currentQ.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                className="chip"
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  borderColor: selectedOpt === i ? "#61dafb" : "rgba(255,255,255,0.2)",
                  background: selectedOpt === i ? "rgba(97, 218, 251, 0.2)" : "rgba(255,255,255,0.05)",
                }}
                onClick={() => handleSelect(i)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button
              type="button"
              className="search-button"
              disabled={selectedOpt === null}
              onClick={handleNext}
            >
              {currentIdx + 1 === QUIZ_QUESTIONS.length ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <h3>Quiz Completed!</h3>
          <p style={{ fontSize: "1.2rem", color: "#61dafb" }}>
            Score: {score} / {QUIZ_QUESTIONS.length}
          </p>
          <button type="button" className="search-button" onClick={handleRestart}>
            Try Again
          </button>
        </div>
      )}
    </ReactModal>
  );
}
