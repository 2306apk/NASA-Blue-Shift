import React, { useState } from "react";
import "../styles/components.css";

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search/nasa/?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const images = Array.isArray(data) ? data : data.results || [];
      setResults(images);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // This will be used for user flow improvement in the next step
  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit">
          Search
        </button>
        {results.length > 0 && (
          <button
            type="button"
            className="search-button"
            style={{ marginLeft: "12px" }}
            onClick={handleClear}
          >
            Clear Search
          </button>
        )}
      </form>

      {loading && <p className="loading-text">Loading...</p>}

      {results.length > 0 && (
        <div className="results-background">
          <div className="image-grid">
            {results.map((item) => (
              <div key={item.nasa_id} className="image-card">
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title}
                  className="grid-image"
                />
                <div className="image-info">
                  <h4>{item.title}</h4>
                  <p>
                    {item.description && item.description.length > 150
                      ? item.description.slice(0, 150) + "..."
                      : item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
