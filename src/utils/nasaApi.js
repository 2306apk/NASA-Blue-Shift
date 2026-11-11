/**
 * Centralized API client for Galactic Gateway – NASA Blue Shift
 *
 * In development, CRA proxies requests to http://localhost:8000 when REACT_APP_API_BASE_URL is empty.
 * In production or custom environments, REACT_APP_API_BASE_URL can point to the backend host.
 */

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Helper to make HTTP requests with timeout and error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const timeout = options.timeout || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(id);

    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData && (errorData.error || errorData.detail || errorData.message)) {
          errorMessage = errorData.error || errorData.detail || errorData.message;
        }
      } catch {
        // Response wasn't JSON
      }
      const err = new Error(errorMessage);
      err.status = res.status;
      throw err;
    }

    if (res.status === 204) {
      return null;
    }

    return await res.json();
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      const err = new Error('Request timed out. Please check your network or try again.');
      err.status = 408;
      throw err;
    }
    if (!error.status) {
      // Network failure / server unreachable
      const err = new Error(
        'Unable to connect to the Galactic Gateway server. Please ensure the backend is running.'
      );
      err.status = 0;
      throw err;
    }
    throw error;
  }
}

/**
 * Search NASA imagery by keyword
 * @param {string} query - Keyword (e.g. 'saturn', 'mars', 'nebula')
 * @param {number} limit - Maximum number of results (1-50)
 */
export async function searchNasaImages(query, limit = 20) {
  if (!query || query.trim().length < 2) {
    throw new Error('Search query must be at least 2 characters long.');
  }
  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(limit),
  });
  return request(`/api/search/nasa/?${params.toString()}`);
}

/**
 * Retrieve detailed metadata for a specific NASA image
 * @param {string} nasaId - The NASA ID of the image
 */
export async function getNasaImageDetails(nasaId) {
  if (!nasaId) throw new Error('NASA ID is required');
  return request(`/api/nasa/image/${encodeURIComponent(nasaId)}/`);
}

/**
 * Fetch popular search queries
 */
export async function getPopularSearches() {
  return request('/api/search/popular/');
}

/**
 * Fetch NASA's Astronomy Picture of the Day (APOD)
 * @param {string} [date] - Optional date in YYYY-MM-DD format
 */
export async function getApod(date = null) {
  const endpoint = date
    ? `/api/nasa/apod/?date=${encodeURIComponent(date)}`
    : '/api/nasa/apod/';
  return request(endpoint);
}

/**
 * List NASA datasets available in the system
 */
export async function getDatasets() {
  return request('/api/datasets/');
}

/**
 * Get details for a specific dataset
 * @param {string} slug - Dataset slug (e.g. 'mars-surface')
 */
export async function getDatasetInfo(slug) {
  return request(`/api/datasets/${encodeURIComponent(slug)}/info/`);
}

/**
 * Get annotations for a dataset
 * @param {string} [datasetSlug] - Optional filter by dataset slug
 */
export async function getAnnotations(datasetSlug = null) {
  const endpoint = datasetSlug
    ? `/api/annotations/?dataset=${encodeURIComponent(datasetSlug)}`
    : '/api/annotations/';
  return request(endpoint);
}

/**
 * Create a new user annotation
 * @param {object} annotation - { dataset, feature_name, x, y, zoom, note }
 */
export async function createAnnotation(annotation) {
  return request('/api/annotations/', {
    method: 'POST',
    body: JSON.stringify(annotation),
  });
}

/**
 * Search user annotations by feature name
 * @param {string} query - Keyword
 */
export async function searchAnnotations(query) {
  return request(`/api/search/?q=${encodeURIComponent(query)}`);
}

/**
 * Build URL to access a map/imagery tile
 */
export function getTileUrl(dataset, z, x, y, ext = 'png') {
  return `${API_BASE_URL}/tiles/${encodeURIComponent(dataset)}/${z}/${x}/${y}.${ext}`;
}

const api = {
  searchNasaImages,
  getNasaImageDetails,
  getPopularSearches,
  getApod,
  getDatasets,
  getDatasetInfo,
  getAnnotations,
  createAnnotation,
  searchAnnotations,
  getTileUrl,
};

export default api;
