# CyberGuardian AI

> AI-powered cyber security training platform that helps users recognize and defend against digital manipulation through realistic scam simulations.

## 🎯 Project Overview

CyberGuardian AI transforms digital safety into an active learning experience. Instead of simply warning users, the platform simulates realistic scam scenarios in a controlled environment, allowing people to experience how manipulation unfolds step by step—without any real-world risk.

## 📁 Project Structure

```
cyberguardian-ai/
├── client/          # Frontend (Vite + React + TypeScript)
├── server/          # Backend (Python/FastAPI) - Planned
├── ai/              # AI/ML modules (prompts, engines)
├── database/        # Database schemas & migrations
├── infra/           # Infrastructure & deployment configs
├── docs/            # Documentation
├── tests/           # Global test suites
└── .github/         # GitHub Actions (CI/CD)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Development

```bash
# Install dependencies
cd client && npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Copy `.env.example` to `client/.env.local` and configure:
```bash
GEMINI_API_KEY=your_api_key_here
```

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling (via CDN)
- **Google Gemini** - AI integration

### Backend (Planned)
- Python with FastAPI
- PostgreSQL database
- Redis for caching

## 📦 Features

- **Realistic Scam Simulations** - Bank fraud, job scams, government impersonation
- **AI Mentor System** - Real-time intervention and guidance
- **Risk Detection** - Pattern recognition and behavioral analysis
- **Progress Tracking** - Dashboard with learning metrics
- **Dark/Light Themes** - Full theme support

## 📄 License

MIT License - see LICENSE file for details.
