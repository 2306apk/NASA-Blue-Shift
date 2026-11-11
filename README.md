# Galactic Gateway – NASA Blue Shift

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-Embiggen%20Your%20Eyes-blue.svg)](https://www.spaceappschallenge.org/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Django%205.2%20REST-092e20.svg)](https://www.djangoproject.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive cosmic observatory and image exploration platform designed for the **NASA International Space Apps Challenge – "Embiggen Your Eyes"**. The "Embiggen Your Eyes" challenge seeks a platform to explore NASA's vast image datasets, enabling zooming, labeling, and pattern discovery. **Galactic Gateway** offers a 2D Milky Way map, 3D Solar System and Earth views with orbits, deep-space search, image matching, and an intuitive UI for cosmic exploration, enabling researchers, educators, and space enthusiasts to inspect and deep-zoom high-resolution imagery from NASA missions including Hubble, JWST, Cassini, Mars Rovers (Curiosity, Perseverance, Opportunity), Landsat, and the ISS.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement & Motivation](#problem-statement--motivation)
3. [NASA Space Apps Context – Embiggen Your Eyes](#nasa-space-apps-context--embiggen-your-eyes)
4. [Key Features](#key-features)
5. [Visual Interface & Screenshots](#visual-interface--screenshots)
6. [Technology Stack](#technology-stack)
7. [System Architecture](#system-architecture)
   - [Frontend Architecture](#frontend-architecture)
   - [Backend Architecture](#backend-architecture)
   - [Communication Flow](#communication-flow)
8. [Repository Structure](#repository-structure)
9. [Prerequisites](#prerequisites)
10. [Local Installation & Setup](#local-installation--setup)
    - [1. Clone Repository](#1-clone-repository)
    - [2. Backend Setup](#2-backend-setup)
    - [3. Frontend Setup](#3-frontend-setup)
    - [4. Running Both Servers](#4-running-both-servers)
11. [API Documentation](#api-documentation)
12. [Configuration & Environment Variables](#configuration--environment-variables)
    - [NASA API Configuration](#nasa-api-configuration)
    - [OpenAI Configuration](#openai-configuration)
13. [Testing](#testing)
    - [Backend Test Suite](#backend-test-suite)
    - [Frontend Test Suite](#frontend-test-suite)
    - [Production Build](#production-build)
14. [Security & Repository Hygiene](#security--repository-hygiene)
15. [Troubleshooting](#troubleshooting)
16. [Deployment Guide](#deployment-guide)
17. [Feature Roadmap & Audit Status](#feature-roadmap--audit-status)
18. [Contributors, License & Acknowledgements](#contributors-license--acknowledgements)

---

## Project Overview

NASA generates petabytes of imagery capturing celestial bodies, planetary topographies, solar eruptions, and distant galaxies. However, accessing and exploring these multi-gigapixel datasets is often hindered by fragmented portals, complex metadata schemas, and prohibitive bandwidth constraints.

**Galactic Gateway – NASA Blue Shift** bridges this gap by unifying NASA's disparate image APIs into a centralized, responsive web platform featuring:
- Live keyword search across NASA Images and Mars Rover photo APIs.
- Interactive deep-zoom, rotation, and pan inspection tools.
- Curated discovery portals for the Solar System, Earth Observatory, and Deep Space Galaxies.
- RESTful caching and spatial annotation infrastructure.

---

## Problem Statement & Motivation

Space imagery often suffers from extreme scale differences: an overview of Saturn or the Eagle Nebula may span thousands of light-years or hundreds of thousands of kilometers, while critical scientific features (e.g., ringlet waves, crater rims, ice plumes) require pixel-level magnification. Traditional static web viewers downscale images, stripping away critical details.

Galactic Gateway solves this by:
1. Fetching full-fidelity imagery on demand while caching metadata locally.
2. Providing smooth multi-scale zoom (`0.5x` to `10x`) and orientation controls.
3. Enabling feature labeling and spatial annotations for collaborative research.

---

## NASA Space Apps Context – Embiggen Your Eyes

The **"Embiggen Your Eyes"** challenge calls on developers and scientists to create innovative tools that make massive NASA image libraries easy to browse, explore, annotate, and comprehend. Galactic Gateway satisfies this challenge through a multi-tiered approach:
- **Search & Discovery**: Instantly query hundreds of thousands of NASA assets.
- **Deep Zoom Inspection**: Inspect subtle geological and astrophysical structures.
- **Categorical Navigation**: Seamless switching between galactic deep field targets, planetary bodies, and Earth observation imagery.

---

## Key Features

- **Multi-Mission NASA Search**: Query images by celestial target (`mars`, `saturn`, `jupiter`, `nebula`, `galaxy`, etc.) with intelligent scientific keyword mapping.
- **Interactive Deep Zoom & Pan**: Powered by `react-zoom-pan-pinch`, supporting smooth mouse-wheel zooming, click-and-drag panning, 90° clockwise/counter-clockwise rotation, and viewport resets.
- **Scientific Metadata Display**: View image titles, NASA IDs, capturing centers (JPL, GSFC, MSFC), creation dates, and full scientific mission summaries.
- **Popular & Suggested Searches**: Real-time aggregation of trending search queries backed by SQLite caching.
- **Astronomy Picture of the Day (APOD)**: Integrated backend proxy for NASA's APOD service with resilient fallback handling.
- **Planetary Annotation REST API**: Create, query, update, and filter custom annotations (craters, storms, geological features) tied to planetary datasets.
- **Tile Server Infrastructure**: Deep zoom tile serving endpoint (`/tiles/<dataset>/<z>/<x>/<y>.<ext>`) for pyramid-tiled gigapixel imagery.
- **Star Wars-Inspired Aesthetic**: Deep-space starry canvas with procedural twinkling animations, monospace typography, and responsive layouts.

---

## Visual Interface & Screenshots

```
+-----------------------------------------------------------------------------------+
|  Blue shift                                        galaxy   Solar system   earth  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|            [ Search stars, planets, nebulae, constellations... ]  [ Search ]      |
|               Suggested:  [mars]  [saturn]  [jupiter]  [earth]  [nebula]          |
|                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+           |
|  | [Saturn Rings Img] |  | [Cassini Portrait] |  | [Enceladus Geyser] |           |
|  | Saturn Atmosphere  |  | Cassini Mosaics    |  | Ice Plumes Observed|           |
|  | Center: JPL        |  | Center: JPL        |  | Center: JPL        |           |
|  +--------------------+  +--------------------+  +--------------------+           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| Deep Zoom Modal: [Zoom In] [Zoom Out] [Rotate L] [Rotate R] [Reset] [Info] [x]    |
+-----------------------------------------------------------------------------------+
```
*(Add production screenshots here: `docs/screenshots/search-view.png`, `docs/screenshots/deep-zoom-modal.png`)*

---

## Technology Stack

### Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Tooling**: Create React App (`react-scripts 5.0.1`)
- **Deep Zoom & Pan**: `react-zoom-pan-pinch 3.7.0`
- **Modal Dialogs**: `react-modal 3.16.3`
- **Iconography**: `react-icons 5.5.0`
- **Styling**: Modern CSS3 with CSS Grid, Flexbox, backdrop filters, and CSS keyframe star animations

### Backend
- **Framework**: Django 5.2 (`Django==5.2.7`)
- **API Engine**: Django REST Framework (`djangorestframework==3.16.1`)
- **CORS Handling**: `django-cors-headers==4.9.0`
- **Database**: SQLite 3 (`db.sqlite3`)
- **HTTP Client**: Requests (`requests==2.32.5`)
- **Image Processing**: Pillow (`pillow==11.3.0`)
- **AI SDK**: OpenAI Python SDK (`openai==2.1.0` - configured for future image pattern matching)

---

## System Architecture

### Frontend Architecture
- **`src/App.jsx`**: Root component wrapping the application.
- **`src/pages/Home.jsx`**: Main view controller handling navigation tab state (`home`, `galaxy`, `solarsystem`, `earth`) and active search targets.
- **`src/components/SearchBar.jsx`**: Central search interface managing user input, live queries, suggested chips, loading indicators, empty states, error banners, and the image result grid.
- **`src/components/ImageModal.jsx`**: Fullscreen modal dialog hosting the deep-zoom canvas, rotation controls, metadata captions, and image load error boundaries.
- **`src/components/GalaxyViewer.jsx`**: Curated deep-space targets (Hubble Deep Field, Andromeda, Sombrero, Carina Nebula).
- **`src/components/SolarSystem.jsx`**: Curated planetary targets (Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune).
- **`src/components/EarthView.jsx`**: Curated Earth observation targets (Blue Marble, ISS night lights, Landsat, Aurora).
- **`src/utils/nasaApi.js`**: Centralized API service layer abstracting network communication, timeouts, and error handling.
- **`src/utils/data.js`**: Celestial presets, date formatting helpers, and search keyword mappings.

### Backend Architecture
- **`backend/settings.py`**: Configured with decoupled environment variable loading, CORS rules, and secure defaults.
- **`backend/urls.py`**: Clean URL router delegating to API viewsets and function views.
- **`api/models.py`**: Models for `Dataset`, `Annotation`, `ImageMetadata`, `TileCache`, `NASASearchResult`, and `SearchQuery`.
- **`api/serializers.py`**: ModelSerializers for datasets, annotations, and metadata.
- **`api/views.py`**: DRF views for search (`search_nasa_images`), details (`get_nasa_image_details`), trending terms (`get_popular_searches`), APOD (`nasa_apod`), dataset CRUD (`DatasetViewSet`), annotation CRUD (`AnnotationViewSet`), and tile serving (`get_tile`).
- **`api/nasa_services.py`**: `NASAImageSearchService` handling live NASA Images API queries, Mars Rover photos, result caching, and `NASADataFetcher` handling APOD.

### Communication Flow

```
[ User Browser / React 19 Frontend ]
                 |
                 | HTTP Requests (JSON)
                 | Development: Proxied via package.json ("proxy": "http://localhost:8000")
                 | Production: Direct to REACT_APP_API_BASE_URL
                 v
[ Django REST Framework (Port 8000) ]
        |                   |                    |
        | Local DB Check    | Live External API  | Tile Storage
        v                   v                    v
  [ SQLite Cache ]   [ NASA Open APIs ]   [ tiles/ Directory ]
  - NASASearchResult - images-api.nasa.gov
  - SearchQuery      - api.nasa.gov/mars-photos
  - Annotations      - api.nasa.gov/planetary/apod
```

---

## Repository Structure

```
NASA-Blue-Shift/
├── .env.example                     # Example frontend environment variables
├── .gitignore                       # Multi-stack gitignore (Python, Node, OS, env)
├── LICENSE                          # MIT License
├── README.md                        # Project documentation (this file)
├── cssnano.config.js                # Build minimizer configuration
├── package.json                     # Frontend dependencies & CRA scripts
├── package-lock.json                # Locked npm dependencies
├── public/                          # Static web assets
│   ├── index.html                   # HTML entrypoint
│   ├── assets/                      # Astronomical asset placeholders
│   └── openseadragon/images/        # Deep-zoom navigation icons
├── src/                             # React frontend source
│   ├── App.jsx                      # App root component
│   ├── App.test.js                  # Frontend test suite
│   ├── index.js                     # React DOM renderer
│   ├── setupTests.js                # Jest DOM configuration
│   ├── components/                  # UI components
│   │   ├── DetailDialogue.jsx       # Feature detail popup
│   │   ├── EarthView.jsx            # Earth observation selector
│   │   ├── GalaxyViewer.jsx         # Deep-space galaxy selector
│   │   ├── ImageDropBox.jsx         # Drag-and-drop image matcher component
│   │   ├── ImageModal.css           # Modal and zoom styling
│   │   ├── ImageModal.jsx           # Deep zoom & pan viewer
│   │   ├── QuizPopup.jsx            # Interactive cosmic knowledge quiz
│   │   ├── SearchBar.css            # Search input styling
│   │   ├── SearchBar.jsx            # Search bar & result grid
│   │   ├── SolarSystem.jsx          # Planetary target selector
│   │   └── ToggleSwitch.jsx         # Toggle switch utility component
│   ├── pages/                       # Page layouts
│   │   ├── EarthPage.jsx            # Earth view page
│   │   ├── Home.jsx                 # Main exploration interface
│   │   ├── ImageSearchPage.jsx      # Search page wrapper
│   │   └── SolarSystemPage.jsx      # Solar system page wrapper
│   ├── styles/                      # Stylesheets
│   │   ├── components.css           # Core components & starfield animations
│   │   └── globals.css              # Global CSS resets
│   └── utils/                       # Frontend utilities
│       ├── __tests__/               # Utility unit tests
│       ├── data.js                  # Celestial constants & presets
│       └── nasaApi.js               # Centralized API service layer
└── nasa-backend/                    # Django backend
    ├── .env.example                 # Example backend environment variables
    ├── manage.py                    # Django management script
    ├── requirements.txt             # Python backend dependencies
    ├── backend/                     # Django core project configuration
    │   ├── asgi.py                  # ASGI server entrypoint
    │   ├── settings.py              # Application settings & environment config
    │   ├── urls.py                  # URL routing definitions
    │   └── wsgi.py                  # WSGI server entrypoint
    └── api/                         # REST API application
        ├── admin.py                 # Django admin registration
        ├── apps.py                  # App configuration
        ├── models.py                # Database models
        ├── serializers.py           # DRF Serializers
        ├── tests.py                 # Backend unit & integration test suite
        ├── views.py                 # API view controllers
        ├── nasa_services.py         # NASA API fetchers & search services
        └── migrations/              # Database migration files
```

---

## Prerequisites

- **Node.js**: v18.x or v20.x or higher (tested on Node v26)
- **npm**: v9.x or higher (tested on npm 11.17)
- **Python**: 3.10, 3.11, or 3.12 (Python 3.11 recommended; Python 3.15 is not recommended due to pydantic/maturin compatibility)
- **Git**

---

## Local Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/2306apk/NASA-Blue-Shift.git
cd NASA-Blue-Shift
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd nasa-backend

# Create a virtual environment using Python 3.11
python3.11 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows (cmd.exe):
# venv\Scripts\activate.bat
# On Windows (PowerShell):
# .\venv\Scripts\Activate.ps1

# Install required Python packages
pip install -r requirements.txt

# Create your local environment file
cp .env.example .env

# Run database migrations
python manage.py migrate

# (Optional) Verify Django tests
python manage.py test api

# Start Django development server (runs on http://localhost:8000)
python manage.py runserver
```

Leave this terminal running.

### 3. Frontend Setup

Open a **new terminal window** in the project root:

```bash
# In repository root:
cd NASA-Blue-Shift

# Create your local environment file
cp .env.example .env

# Install frontend dependencies
npm install

# Run frontend tests
npm test -- --watchAll=false

# Start React development server (runs on http://localhost:3000)
npm start
```

### 4. Running Both Servers

- **Backend**: `http://localhost:8000` (API root: `http://localhost:8000/`)
- **Frontend**: `http://localhost:3000`
- The React development server automatically forwards requests from `/api/*` to `http://localhost:8000` via the proxy defined in `package.json`.

---

## API Documentation

All endpoints are verified against the active Django REST Framework implementation.

| HTTP Method | Endpoint | Purpose | Parameters / Payload | Response Format |
|---|---|---|---|---|
| `GET` | `/` | API Root & Health Check | None | `{"message": "...", "endpoints": {...}, "available_searches": [...]}` |
| `GET` | `/api/search/nasa/` | Search NASA imagery by keyword | `q` (required, min 2 chars)<br>`limit` (optional, 1–50, default 20) | `{"query": "saturn", "count": 20, "results": [...]}` |
| `GET` | `/api/nasa/image/<nasa_id>/` | Get detailed metadata for cached image | `nasa_id` (string, path parameter) | `{"nasa_id": "...", "title": "...", "description": "...", "keywords": [...], "image_url": "...", "thumbnail_url": "...", "center": "...", "date_created": "...", "media_type": "image"}` |
| `GET` | `/api/search/popular/` | Get top search terms | None | `{"popular_searches": [{"query": "mars", "count": 12, "last_searched": "..."}]}` |
| `GET` | `/api/nasa/apod/` | Astronomy Picture of the Day | `date` (optional, `YYYY-MM-DD`) | `{"title": "...", "url": "...", "explanation": "...", "date": "...", "media_type": "..."}` |
| `GET` | `/api/datasets/` | List registered spatial datasets | None | `{"count": 0, "next": null, "previous": null, "results": [...]}` |
| `GET` | `/api/datasets/<slug>/` | Retrieve specific dataset details | `slug` (string, path parameter) | Dataset JSON object |
| `GET` | `/api/datasets/<slug>/info/` | Custom dataset information | `slug` (string, path parameter) | Dataset JSON object |
| `GET` | `/api/annotations/` | List annotations (filterable by dataset) | `dataset` (optional query param, dataset slug) | `{"count": 0, "next": null, "previous": null, "results": [...]}` |
| `POST` | `/api/annotations/` | Create a user spatial annotation | Body: `{"dataset": 1, "feature_name": "Crater", "x": 10.0, "y": 20.0, "zoom": 2, "note": "..."}` | Created Annotation JSON object (HTTP 201) |
| `GET` | `/api/annotations/<id>/` | Retrieve single annotation | `id` (integer, path parameter) | Annotation JSON object |
| `PUT` | `/api/annotations/<id>/` | Update existing annotation | `id` (integer, path parameter), JSON body | Updated Annotation JSON object |
| `DELETE` | `/api/annotations/<id>/` | Delete an annotation | `id` (integer, path parameter) | HTTP 204 No Content |
| `GET` | `/api/search/` | Search annotations by feature name | `q` (string, query parameter) | `{"results": [...]}` |
| `GET` | `/tiles/<dataset>/<z>/<x>/<y>.<ext>` | Serve map tiles for deep zoom / GIS | Path: `dataset`, `z`, `x`, `y`, `ext` (`png` or `jpg`) | Binary image or HTTP 404 |

---

## Configuration & Environment Variables

### NASA API Configuration

1. Visit [https://api.nasa.gov/](https://api.nasa.gov/) to generate a free API key.
2. In `nasa-backend/.env`, set:
   ```env
   NASA_API_KEY=your_actual_nasa_api_key_here
   NASA_BASE_URL=https://api.nasa.gov
   ```
3. If no key is configured, the application automatically falls back to `'DEMO_KEY'`.
4. **Security Notice**: NASA API keys are consumed **exclusively on the Django backend** and are never exposed in frontend bundles or client network requests.

### OpenAI Configuration (Optional)

1. If deploying image pattern matching or AI description features, obtain an API key from [OpenAI](https://platform.openai.com/).
2. In `nasa-backend/.env`, set:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. The SDK is pre-installed (`openai==2.1.0`) and ready for backend extension.

---

## Testing

### Backend Test Suite

The Django test suite validates URL routing, error responses (e.g. missing query parameters), cached lookups, mock external fetches, dataset and annotation CRUD, APOD fallback, and tile serving:

```bash
cd nasa-backend
source venv/bin/activate
python manage.py test api
```

Expected output:
```
Ran 13 tests in 0.020s
OK
```

### Frontend Test Suite

The React test suite tests core rendering, navigation tabs, search inputs, modal boundaries, and API client request mapping:

```bash
npm test -- --watchAll=false
```

Expected output:
```
Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Ran all test suites.
```

### Production Build

Verify that the production assets compile cleanly without module or minimizer failures:

```bash
npm run build
```

---

## Security & Repository Hygiene

- **`.env` Exclusion**: All `.env` files are untracked and protected in `.gitignore`.
- **Node Modules Tracking**: `node_modules/` has been purged from git tracking via `git rm -r --cached node_modules`.
- **Credential Rotation Notice**: An API key previously committed to git history has been identified and must be rotated at [api.nasa.gov](https://api.nasa.gov/).
- **No Client Secrets**: The frontend only accesses backend endpoints via `REACT_APP_API_BASE_URL` or the local CRA proxy; no upstream NASA or OpenAI tokens reside on the client.

---

## Troubleshooting

### 1. `EPERM: operation not permitted` during `npm run build`
- **Cause**: Webpack's CSS minimizer traversing parent directories for cosmiconfig.
- **Solution**: A root `cssnano.config.js` is included in the repository to pin configuration resolution to the project root.

### 2. NASA API Rate Limit (HTTP 429)
- **Cause**: Using the default `DEMO_KEY` exceeds NASA's hourly request limit (30 requests/hour).
- **Solution**: Obtain a free personalized API key at [api.nasa.gov](https://api.nasa.gov/) and set `NASA_API_KEY=...` in `nasa-backend/.env`.

### 3. Missing Tile HTTP 404
- **Cause**: Deep zoom map tiles have not been generated yet for that zoom level.
- **Solution**: This is expected for ungenerated tiles. The backend safely returns HTTP 404 without crashing.

### 4. CORS Errors in Production
- **Cause**: Frontend origin not whitelisted in Django settings.
- **Solution**: Set `DJANGO_ALLOWED_HOSTS` and configure `CORS_ALLOWED_ORIGINS` in `nasa-backend/.env`.

---

## Deployment Guide

### Frontend Deployment (Static Hosting)
1. Run `npm run build` to generate the static assets in `build/`.
2. Deploy the `build/` folder to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
3. Configure the environment variable:
   ```env
   REACT_APP_API_BASE_URL=https://your-backend-domain.com
   ```

### Backend Deployment (Container / Cloud Run / VPS)
1. Run using a production WSGI server such as Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```
2. Set production environment variables in your hosting provider:
   ```env
   DEBUG=False
   DJANGO_SECRET_KEY=generate-a-strong-random-key
   DJANGO_ALLOWED_HOSTS=your-backend-domain.com
   NASA_API_KEY=your-nasa-key
   ```
3. Set up a reverse proxy (e.g. Nginx or Cloudflare) to route requests and serve `/media/` and `/tiles/` if used.

---

## Feature Roadmap & Audit Status

| Feature Target | Status | Implementation Details |
|---|---|---|
| **NASA Image Search** | Verified Working | End-to-end integration with keyword filtering, caching in `NASASearchResult`, and responsive card grid. |
| **Deep Zoom & Pan** | Verified Working | Client-side pan, zoom (`0.5x` to `10x`), 90° rotation, reset, and metadata overlay via `react-zoom-pan-pinch`. |
| **Search Suggestions** | Verified Working | Live trending search frequency queries via `/api/search/popular/`. |
| **NASA APOD Integration** | Verified Working | Backend endpoint `/api/nasa/apod/` with resilient fallback handling. |
| **Spatial Annotations** | Verified Working | Complete REST CRUD API (`/api/annotations/`) and feature search. |
| **Tile Server Infrastructure** | Verified Working | Deep zoom tile serving endpoint (`/tiles/<dataset>/<z>/<x>/<y>.<ext>`). |
| **2D Milky Way Canvas Map** | In Development | Target for future interactive WebGL/SVG celestial projection. Curated deep-sky targets active in UI. |
| **3D Solar System View** | In Development | Target for future Three.js orbital physics simulator. Planetary navigation active in UI. |
| **3D Earth View** | In Development | Target for future Cesium / Three.js globe. Earth Observatory navigation active in UI. |
| **AI Image Matching** | In Development | OpenAI SDK pre-installed in backend. UI component `ImageDropBox.jsx` available for client drop events. |

---

## Contributors, License & Acknowledgements

### Contributors
- **Apoorva Kogta** ([@2306apk](https://github.com/2306apk)) — Contributor & Project Integration

### License
- Released under the [MIT License](LICENSE).

### Acknowledgements
- [NASA Open APIs](https://api.nasa.gov/) for providing open-access astrophysics and planetary data.
- [NASA International Space Apps Challenge](https://www.spaceappschallenge.org/) organizers, mentors, and global community.
