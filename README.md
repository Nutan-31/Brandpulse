# BrandPulse

### AI-Powered Social Media Marketing & Content Intelligence Platform

BrandPulse is a full-stack AI marketing platform that helps businesses understand social media trends, generate content ideas, and prepare short-form video concepts from a single dashboard.

It combines social media trend analysis, AI-powered content generation, and video concept preparation into one streamlined workflow.

---

## ✨ Features

### 🏷️ Brand Setup

Configure your brand before generating marketing insights.

* Brand name
* Industry
* Target audience
* Brand description
* Brand tone
* Additional brand information

The brand configuration is stored and used as context for trend analysis and AI-generated content.

---

### 📊 Trend Analysis

BrandPulse analyzes current social media signals to identify relevant trends and opportunities.

The platform uses **Apify** to collect Instagram hashtag/social-media data and extracts useful marketing signals from the collected content.

Trend analysis can help identify:

* Trending topics
* Popular hashtags
* Content patterns
* Engagement signals
* Relevant content opportunities
* Topics that may be useful for the selected brand

---

### 💡 AI Content Ideas

BrandPulse uses **Groq with Llama 3.3 70B** to transform brand information and trend signals into actionable short-form content concepts.

Generated concepts can include:

* Content hooks
* Reel concepts
* Captions
* Content direction
* Target audience
* Creative angles
* Suggested execution ideas

The generated ideas are displayed directly inside the BrandPulse dashboard.

---

### 🎬 Video Studio

The Video Studio converts selected content ideas into video-generation workflows.

The backend supports:

* Video generation requests
* Background video generation jobs
* Job-status tracking
* Generated video retrieval
* Video download

The system is designed to work with **fal.ai** and provides a fallback path through **Replicate** when applicable.

If a video-generation API key is unavailable, BrandPulse can still prepare the video workflow without breaking the rest of the application.

---

## 🧠 AI Workflow

BrandPulse follows a simple marketing workflow:

```text
Brand Setup
     ↓
Trend Analysis
     ↓
AI Content Concepts
     ↓
Video Studio
```

### 1. Brand Setup

The user provides information about the brand.

### 2. Trend Analysis

BrandPulse collects and processes relevant social-media signals.

### 3. Content Generation

The trend information and brand context are sent to the LLM to generate content concepts.

### 4. Video Studio

The user selects a concept and starts the video-generation workflow.

---

# 🏗️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Lucide React

## Backend

* Python
* FastAPI
* Uvicorn

## Database

* MongoDB

## AI & Data Services

* Groq
* Llama 3.3 70B
* Apify
* fal.ai
* Replicate

---

# 📁 Project Structure

```text
BrandPulse/
│
├── brandpulse/
│   ├── api.py
│   ├── brand_config.json
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── BrandSetup.jsx
│   │   │   ├── TrendFeed.jsx
│   │   │   ├── IdeaCards.jsx
│   │   │   └── VideoStudio.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .env
├── README.md
└── ...
```

---

# 🔄 Application Flow

BrandPulse is organized into four main stages:

### 01 — Brand

The user enters and saves their brand information.

### 02 — Signals

The application retrieves and analyzes relevant social-media trends.

### 03 — Concepts

The AI generates content concepts based on the brand and analyzed trends.

### 04 — Studio

The selected concept can be taken into the video-generation workflow.

---

# 🔌 Backend API

The FastAPI backend exposes the following main endpoints.

### Brand

```http
GET /api/brand
```

Retrieves the currently saved brand configuration.

```http
POST /api/brand
```

Saves or updates the brand configuration.

---

### Trends

```http
GET /api/trends
```

Retrieves analyzed social-media trends and signals for the configured brand.

---

### Content Ideas

```http
POST /api/generate
```

Generates AI-powered content concepts using the configured brand information and trend signals.

---

### Video Generation

```http
POST /api/video
```

Starts a video-generation job.

```http
GET /api/video/{job_id}
```

Checks the status of a video-generation job.

```http
GET /api/download/{job_id}
```

Downloads the generated video when available.

---

# ⚙️ Environment Variables

Create a `.env` file in the backend/project environment and configure the required API keys.

Example:

```env
APIFY_API_TOKEN=your_apify_token
APIFY_ACTOR_ID=your_apify_actor_id

GROQ_API_KEY=your_groq_api_key

FAL_KEY=your_fal_api_key

REPLICATE_API_TOKEN=your_replicate_api_token
```

Do **not** commit real API keys to GitHub.

Use placeholder values when sharing the project publicly.

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/Nutan-31/Brandpulse.git
```

Navigate into the project:

```bash
cd Brandpulse
```

---

# 🐍 Backend Setup

Navigate to the backend directory:

```powershell
cd brandpulse
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required Python packages:

```powershell
pip install -r requirements.txt
```

---

## ▶️ Start the Backend

Run FastAPI with Uvicorn:

```powershell
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal and navigate to the frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# 🔗 Frontend ↔ Backend

The frontend communicates with the FastAPI backend through the `/api` routes.

The Vite development server proxies API requests to:

```text
http://localhost:8000
```

This allows the React application to call endpoints such as:

```text
/api/brand
/api/trends
/api/generate
/api/video
```

without directly hardcoding the backend URL throughout the frontend.

---

# 🖥️ Dashboard

The BrandPulse dashboard contains a persistent navigation sidebar and a main workspace.

The primary navigation includes:

* Overview
* Brand
* Trends
* Ideas
* Video Studio
* Settings
* Help & Support

The main workflow is organized around:

```text
Brand → Signals → Concepts → Studio
```

The dashboard is designed to keep the complete marketing workflow inside one workspace instead of requiring the user to switch between multiple tools.

---

# 🎨 UI & Design

BrandPulse uses a modern AI-product dashboard interface focused on:

* Clean workspace layout
* Persistent sidebar navigation
* Responsive dashboard components
* Content cards
* Trend signals
* AI-generated concepts
* Video workflow controls
* Clear visual hierarchy

The interface is built to make the transition from **research → idea → execution** straightforward.

---

# 🧩 Main Frontend Components

## `BrandSetup.jsx`

Handles:

* Brand information input
* Brand configuration
* Saving brand data
* Moving the user into trend analysis

---

## `TrendFeed.jsx`

Displays:

* Social-media trends
* Trend signals
* Relevant content information
* Trend analysis results

---

## `IdeaCards.jsx`

Displays AI-generated marketing concepts.

Each concept can provide information such as:

* Hook
* Concept
* Caption
* Creative direction
* Target audience
* Content execution

---

## `VideoStudio.jsx`

Handles the video workflow.

It allows the user to take a selected content concept into the video-generation process.

---

# 🧠 AI Architecture

The application separates data collection, AI reasoning, and content execution.

```text
                  ┌──────────────────┐
                  │   Brand Setup    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  Social Signals  │
                  │     (Apify)      │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  Trend Analysis  │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Groq / Llama   │
                  │     3.3 70B      │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Content Concepts │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Video Studio   │
                  └──────────────────┘
```

---

# 🗄️ Data & Configuration

BrandPulse maintains the active brand configuration using:

```text
brand_config.json
```

The application uses the saved brand configuration as context for subsequent operations.

This allows the trend and content-generation workflow to remain connected to the selected brand.

---

# 🛡️ API Key Safety

Never expose API keys in:

* GitHub repositories
* Screenshots
* README files
* Frontend source code
* Public documentation

Keep secrets inside environment variables.

Example:

```env
GROQ_API_KEY=your_secret_key
```

The `.env` file should be excluded from version control.

---

# 🧪 Development

For local development, run the backend and frontend separately.

### Terminal 1 — Backend

```powershell
cd D:\brandapp\brandpulse
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 — Frontend

```powershell
cd D:\brandapp\frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🏭 Production Build

To create a production frontend build:

```powershell
cd frontend
npm run build
```

The generated production files will be placed in the Vite build output directory.

---

# 🐛 Troubleshooting

## Backend does not start

Make sure you are running Uvicorn from the backend directory containing `api.py`.

Correct:

```powershell
cd D:\brandapp\brandpulse
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

---

## Frontend cannot connect to backend

Check that the FastAPI server is running:

```text
http://localhost:8000/docs
```

Then check that the frontend is running:

```text
http://localhost:3000
```

---

## Video generation does not start

Check that the required video-generation API key is configured.

If the primary video provider is unavailable or has insufficient balance, the application can use its supported fallback path when configured.

---

## AI generation does not work

Check:

```env
GROQ_API_KEY
```

and verify that the API key is valid.

---

## Trend analysis does not return data

Check the Apify configuration:

```env
APIFY_API_TOKEN
APIFY_ACTOR_ID
```

Also verify that the configured actor is available and returning the expected social-media data.

---

# 📌 Current Project Status

BrandPulse currently provides an end-to-end workflow for:

* Brand configuration
* Social-media trend analysis
* AI-generated marketing concepts
* Short-form content planning
* Video-generation workflow
* Dashboard-based navigation
* Local development using React + FastAPI

The architecture is designed so additional AI capabilities can be added without changing the overall workflow.

---

# 🔮 Future Improvements

Potential future improvements include:

* More advanced trend scoring
* Expanded social-media sources
* Better content-performance prediction
* Automated content calendars
* Brand performance analytics
* More video-generation providers
* AI-assisted video editing
* Automated publishing workflows
* Content scheduling
* Campaign-level analytics
* AI voice assistance inside the Video Studio workflow

---

# 👥 Project

**BrandPulse**

An AI-powered marketing workspace designed to help brands move from:

```text
Discover → Understand → Create → Execute
```

---

## 📄 License

This project is currently intended for development and educational/project purposes.
