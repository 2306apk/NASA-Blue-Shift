import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import * as nasaApi from "./utils/nasaApi";

describe("Galactic Gateway Frontend Workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nasaApi, "getPopularSearches").mockResolvedValue({
      popular_searches: [
        { query: "mars", count: 10 },
        { query: "saturn", count: 8 },
        { query: "jupiter", count: 6 },
        { query: "earth", count: 5 },
        { query: "moon", count: 4 },
        { query: "sun", count: 3 },
      ],
    });
  });

  const renderApp = async () => {
    const rendered = render(<App />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "mars" })).toBeInTheDocument();
    });
    return rendered;
  };

  test("1. Renders navigation items and brand", async () => {
    await renderApp();
    expect(screen.getByText(/Blue shift/i)).toBeInTheDocument();
    expect(screen.getByText("galaxy")).toBeInTheDocument();
    expect(screen.getByText("Solar system")).toBeInTheDocument();
    expect(screen.getAllByText(/earth/i).length).toBeGreaterThanOrEqual(1);
  });

  test("2. Navbar tab switching (Galaxy, Solar System, Earth, Home)", async () => {
    await renderApp();

    // Switch to Galaxy tab
    fireEvent.click(screen.getByText("galaxy"));
    expect(screen.getByText(/Galactic Gateway 2D Deep Space Explorer/i)).toBeInTheDocument();
    expect(screen.getByText("Milky Way Center")).toBeInTheDocument();

    // Switch to Solar System tab
    fireEvent.click(screen.getByText("Solar system"));
    expect(screen.getByText(/Solar System Explorer/i)).toBeInTheDocument();
    expect(screen.getByText("Saturn")).toBeInTheDocument();

    // Switch to Earth tab
    const earthNav = screen.getAllByText(/earth/i)[0];
    fireEvent.click(earthNav);
    expect(screen.getByText(/Earth Observatory/i)).toBeInTheDocument();
    expect(screen.getByText("Blue Marble")).toBeInTheDocument();

    // Switch back to Home (Blue shift)
    fireEvent.click(screen.getByText(/Blue shift/i));
    expect(screen.queryByText(/Earth Observatory/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Solar System Explorer/i)).not.toBeInTheDocument();
  });

  test("3. Search workflow: loading, results display, and card click to deep zoom modal", async () => {
    const mockResults = {
      query: "saturn",
      count: 1,
      results: [
        {
          nasa_id: "PIA01973",
          title: "Saturn Atmosphere and Rings",
          description: "High resolution view of Saturn rings captured by Cassini spacecraft.",
          image_url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
          thumbnail_url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
          center: "JPL",
          date_created: "2024-05-15T00:00:00Z",
          media_type: "image",
        },
      ],
    };

    jest.spyOn(nasaApi, "searchNasaImages").mockResolvedValueOnce(mockResults);

    await renderApp();

    const input = screen.getByPlaceholderText(/Search stars, planets/i);
    const searchButton = screen.getByRole("button", { name: /^Search$/i });

    fireEvent.change(input, { target: { value: "saturn" } });
    fireEvent.click(searchButton);

    // Verify loading state
    expect(screen.getByText(/Scanning NASA cosmic databases/i)).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Saturn Atmosphere and Rings")).toBeInTheDocument();
    });

    expect(screen.getByText(/Center: JPL/i)).toBeInTheDocument();
    expect(screen.getByText(/Found 1 imagery results for/i)).toBeInTheDocument();

    // Click on image card to open Deep Zoom modal
    fireEvent.click(screen.getByText("Saturn Atmosphere and Rings"));

    // Verify modal elements
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Zoom In/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Zoom Out/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Rotate Left/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Rotate Right/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Close modal/i })).toBeInTheDocument();
    });

    // Close modal
    fireEvent.click(screen.getByRole("button", { name: /Close modal/i }));
  });

  test("4. Empty results state", async () => {
    jest.spyOn(nasaApi, "searchNasaImages").mockResolvedValueOnce({
      query: "nonexistentcelestialtarget",
      count: 0,
      results: [],
    });

    await renderApp();

    const input = screen.getByPlaceholderText(/Search stars, planets/i);
    const searchButton = screen.getByRole("button", { name: /^Search$/i });

    fireEvent.change(input, { target: { value: "nonexistentcelestialtarget" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/No NASA imagery matched/i)).toBeInTheDocument();
    });
  });

  test("5. Error state handling when backend/network fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(nasaApi, "searchNasaImages").mockRejectedValueOnce(
      new Error("Unable to connect to the Galactic Gateway server.")
    );

    await renderApp();

    const input = screen.getByPlaceholderText(/Search stars, planets/i);
    const searchButton = screen.getByRole("button", { name: /^Search$/i });

    fireEvent.change(input, { target: { value: "errorquery" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Connection Notice:/i)).toBeInTheDocument();
      expect(screen.getByText(/Unable to connect to the Galactic Gateway server/i)).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  test("6. Suggested chip click triggers immediate query", async () => {
    const mockResults = {
      query: "mars",
      count: 1,
      results: [
        {
          nasa_id: "mars-01",
          title: "Mars Surface Panorama",
          description: "Curiosity mastcam view",
          image_url: "https://example.com/mars.jpg",
          thumbnail_url: "https://example.com/mars_thumb.jpg",
          center: "JPL",
          date_created: "2024-01-01T00:00:00Z",
        },
      ],
    };

    const spy = jest.spyOn(nasaApi, "searchNasaImages").mockResolvedValueOnce(mockResults);

    await renderApp();

    const marsChip = screen.getByRole("button", { name: "mars" });
    fireEvent.click(marsChip);

    expect(spy).toHaveBeenCalledWith("mars", 24);
  });
});
