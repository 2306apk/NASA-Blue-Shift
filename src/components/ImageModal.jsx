import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaUndoAlt,
  FaRedoAlt,
  FaSyncAlt,
  FaInfoCircle,
} from "react-icons/fa";
import "./ImageModal.css";
import { formatDate } from "../utils/data";

if (typeof document !== "undefined" && document.getElementById("root")) {
  ReactModal.setAppElement("#root");
}

export default function ImageModal({ isOpen, onRequestClose, imageUrl, imageDetails }) {
  const [angle, setAngle] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAngle(0);
      setImgError(false);
      setShowInfo(true);
    }
  }, [isOpen, imageUrl]);

  const rotateLeft = () => setAngle((prev) => prev - 90);
  const rotateRight = () => setAngle((prev) => prev + 90);
  const resetAll = (resetTransform) => {
    resetTransform();
    setAngle(0);
  };

  const title = imageDetails?.title || "NASA Deep Space Imagery";
  const description = imageDetails?.description || "";
  const center = imageDetails?.center;
  const dateStr = imageDetails?.date_created ? formatDate(imageDetails.date_created) : null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close" onClick={onRequestClose} aria-label="Close modal">
        &times;
      </button>

      <div className="zoom-container">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={10}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="tools-container">
                <button onClick={() => zoomIn()} aria-label="Zoom In" title="Zoom In">
                  <FaSearchPlus />
                </button>
                <button onClick={() => zoomOut()} aria-label="Zoom Out" title="Zoom Out">
                  <FaSearchMinus />
                </button>
                <button onClick={rotateLeft} aria-label="Rotate Left" title="Rotate Left (90°)">
                  <FaUndoAlt />
                </button>
                <button onClick={rotateRight} aria-label="Rotate Right" title="Rotate Right (90°)">
                  <FaRedoAlt />
                </button>
                <button onClick={() => resetAll(resetTransform)} aria-label="Reset" title="Reset View">
                  <FaSyncAlt />
                </button>
                {description && (
                  <button
                    onClick={() => setShowInfo((prev) => !prev)}
                    aria-label="Toggle Info"
                    title="Toggle Info"
                    style={{ color: showInfo ? "#61dafb" : "white" }}
                  >
                    <FaInfoCircle />
                  </button>
                )}
              </div>

              <TransformComponent>
                {imgError ? (
                  <div className="modal-error">
                    <p>Unable to load high-resolution image from NASA asset server.</p>
                    <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                      URL: {imageUrl}
                    </p>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={title}
                    onError={() => setImgError(true)}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "75vh",
                      objectFit: "contain",
                      userSelect: "none",
                      transform: `rotate(${angle}deg)`,
                      transition: "transform 0.3s",
                    }}
                  />
                )}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {showInfo && (title || description) && (
        <div className="modal-caption">
          <h3>{title}</h3>
          {(center || dateStr) && (
            <div style={{ fontSize: "0.8rem", color: "#61dafb", marginBottom: "4px" }}>
              {center && <span>Center: {center}</span>}
              {center && dateStr && <span> | </span>}
              {dateStr && <span>Captured: {dateStr}</span>}
            </div>
          )}
          {description && <p>{description}</p>}
        </div>
      )}
    </ReactModal>
  );
}
