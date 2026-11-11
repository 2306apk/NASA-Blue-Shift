import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import GalaxyViewer from "../components/GalaxyViewer";
import SolarSystem from "../components/SolarSystem";
import EarthView from "../components/EarthView";
import "../styles/components.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchTarget, setSearchTarget] = useState("");

  const handleSelectTarget = (query) => {
    setSearchTarget(query);
  };

  return (
    <div className="star-background">
      <nav className="navbar">
        <span
          className={`nav-item left ${activeTab === "home" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("home");
            setSearchTarget("");
          }}
          title="Return to Home Explorer"
          style={{ cursor: "pointer" }}
        >
          Blue shift
        </span>
        <div className="nav-right">
          <span
            className={`nav-item ${activeTab === "galaxy" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("galaxy");
              setSearchTarget("galaxy");
            }}
          >
            galaxy
          </span>
          <span
            className={`nav-item ${activeTab === "solarsystem" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("solarsystem");
              setSearchTarget("saturn");
            }}
          >
            Solar system
          </span>
          <span
            className={`nav-item ${activeTab === "earth" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("earth");
              setSearchTarget("earth");
            }}
          >
            earth
          </span>
        </div>
      </nav>

      <div style={{ width: "100%", padding: "0 20px" }}>
        {activeTab === "galaxy" && <GalaxyViewer onSelectTarget={handleSelectTarget} />}
        {activeTab === "solarsystem" && <SolarSystem onSelectBody={handleSelectTarget} />}
        {activeTab === "earth" && <EarthView onSelectEarthTopic={handleSelectTarget} />}

        <SearchBar
          key={`${activeTab}-${searchTarget}`}
          placeholder={
            activeTab === "galaxy"
              ? "Search galaxies, nebulae, deep space clusters..."
              : activeTab === "solarsystem"
              ? "Search planets, moons, rovers..."
              : activeTab === "earth"
              ? "Search Earth views, satellites, landsat..."
              : "Search stars, planets, nebulae, constellations..."
          }
          defaultQuery={searchTarget}
        />
      </div>
    </div>
  );
};

export default Home;
