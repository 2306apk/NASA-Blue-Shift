import React, { useState, useEffect } from "react";
import "../styles/components.css";
import ImageModal from "./ImageModal";
import { searchNasaImages, getPopularSearches } from "../utils/nasaApi";
import { POPULAR_KEYWORDS, formatDate } from "../utils/data";

export default function SearchBar({ placeholder, defaultQuery = "" }) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [popularSearches, setPopularSearches] = useState([]);

  // Fetch popular searches from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadPopular() {
      try {
        const data = await getPopularSearches();
        if (isMounted && data && Array.isArray(data.popular_searches) && data.popular_searches.length > 0) {
          setPopularSearches(data.popular_searches.map((p) => p.query));
        } else {
          setPopularSearches(POPULAR_KEYWORDS.slice(0, 6));
        }
      } catch {
        if (isMounted) {
          setPopularSearches(POPULAR_KEYWORDS.slice(0, 6));
        }
      }
    }
    loadPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  const performSearch = async (searchTerm) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setLastQuery(term);

    try {
      const data = await searchNasaImages(term, 24);
      const images = Array.isArray(data) ? data : data.results || [];
      setResults(images);
    } catch (err) {
      console.error("Search failed:", err);
      setError(
        err.message || "Failed to communicate with the NASA image search service."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleChipClick = (term) => {
    setQuery(term);
    performSearch(term);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
    setLastQuery("");
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setModalOpen(true);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          className="search-input"
          placeholder={placeholder || "Search stars, planets, galaxies..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        {(results.length > 0 || hasSearched || query) && (
          <button
            type="button"
            className="search-button"
            style={{ marginLeft: "8px" }}
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </form>

      {/* Popular quick chips */}
      <div className="popular-chips">
        <span style={{ fontSize: "0.8rem", color: "#888", alignSelf: "center" }}>
          Suggested:
        </span>
        {(popularSearches.length > 0 ? popularSearches : POPULAR_KEYWORDS.slice(0, 6)).map(
          (term) => (
            <button
              key={term}
              type="button"
              className="chip"
              onClick={() => handleChipClick(term)}
            >
              {term}
            </button>
          )
        )}
      </div>

      {/* Loading indicator */}
      {loading && <p className="loading-text">Scanning NASA cosmic databases...</p>}

      {/* Error state */}
      {error && !loading && (
        <div className="error-banner">
          <strong>Connection Notice:</strong> {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && hasSearched && results.length === 0 && (
        <div className="empty-state">
          <p>No NASA imagery matched "<strong>{lastQuery}</strong>".</p>
          <p style={{ fontSize: "0.85rem" }}>
            Try searching for solar system bodies like <em>mars</em>, <em>jupiter</em>, <em>saturn</em>, <em>moon</em>, or deep space objects like <em>nebula</em> or <em>galaxy</em>.
          </p>
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="results-background">
          <div style={{ textAlign: "left", marginBottom: "12px", color: "#aaa", fontSize: "0.85rem" }}>
            Found {results.length} imagery results for "<strong>{lastQuery}</strong>" (Click any card to pan & deep-zoom)
          </div>
          <div className="image-grid">
            {results.map((item) => (
              <div
                key={item.nasa_id || item.image_url}
                className="image-card"
                onClick={() => handleImageClick(item)}
                style={{ cursor: "zoom-in" }}
                title="Click to open deep zoom view"
              >
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title || "NASA image"}
                  className="grid-image"
                  loading="lazy"
                />
                <div className="image-info">
                  <h4>{item.title || "Untitled NASA Image"}</h4>
                  {(item.center || item.date_created) && (
                    <div className="card-meta">
                      {item.center && <span>Center: {item.center}</span>}
                      {item.date_created && (
                        <span>{formatDate(item.date_created)}</span>
                      )}
                    </div>
                  )}
                  <p>
                    {item.description && item.description.length > 180
                      ? item.description.slice(0, 180) + "..."
                      : item.description || "No description provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep zoom modal */}
      <ImageModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        imageUrl={selectedImage?.image_url || selectedImage?.thumbnail_url || ""}
        imageDetails={selectedImage}
      />
    </div>
  );
}
