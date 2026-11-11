import { searchNasaImages, getNasaImageDetails } from "../nasaApi";

describe("nasaApi utility", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("searchNasaImages rejects query shorter than 2 characters", async () => {
    await expect(searchNasaImages("a")).rejects.toThrow(
      "Search query must be at least 2 characters long."
    );
  });

  test("searchNasaImages calls backend API and returns data", async () => {
    const mockData = {
      query: "saturn",
      count: 1,
      results: [{ nasa_id: "saturn-1", title: "Saturn Rings" }],
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await searchNasaImages("saturn");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/search/nasa/?q=saturn&limit=20"),
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  test("getNasaImageDetails throws error if nasaId is empty", async () => {
    await expect(getNasaImageDetails("")).rejects.toThrow("NASA ID is required");
  });
});
