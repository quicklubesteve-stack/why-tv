# AGENTS.md - Agent & Developer Workflow Guide for WHY IPTV

This guide documents the architecture, autonomous test protocols, coding standards, and operational guidelines for agents and engineers working on the WHY IPTV project.

---

## 1. Project Mission & Academic Context
WHY IPTV is a capstone academic software engineering project demonstrating:
1. **Zero-Hallucination AI**: Natural language discovery, channel clustering, and predictive categorization mapped strictly to confirmed live broadcast streams.
2. **Authorized IPTV Aggregation**: Legal integration with upstream provider CDN infrastructure (FAST syndicators, Canadian BDUs, and public broadcaster endpoints).
3. **Living-Room Experience**: High-performance television guide UI matching TiviMate, accessible via remote control D-pad on Windows laptops and Android TV.

---

## 2. Core Architecture & File Structure
```
c:\Users\steve\OneDrive\Desktop\tv\
├── src/
│   ├── components/
│   │   ├── PremiumTvGuide.tsx     # Primary Television Guide Interface (Preview + Horizontal EPG)
│   │   ├── Player.tsx             # HLS Adaptive Video Player & Diagnostics HUD
│   │   ├── AiAssistantModal.tsx   # Neural Semantic AI Discovery & Deduplication UI
│   │   ├── AboutAcademicModal.tsx # Interactive Academic Dossier & Capstone Overview
│   │   ├── ProviderHubModal.tsx   # Operational Provider Management Dashboard
│   │   ├── SportsCompanionBar.tsx # Real-Time Sports Score Bug & Matchday Center
│   │   └── SportsHubView.tsx      # Comprehensive Multi-League Sports Dashboard
│   ├── data/
│   │   ├── demoData.ts            # Baseline Canadian & International Channel Catalog (Ch 101-159)
│   │   ├── providerData.ts        # 18 Authorized Provider Profiles & Channels (Ch 201-804)
│   │   ├── sportsData.ts          # Live Sports Scores, Leagues & Match Schedules
│   │   └── vodData.ts             # On-Demand VOD Blockbusters & Series
│   ├── services/
│   │   └── storageService.ts      # LocalStorage & Initial Roster Bootstrapper (104 Channels)
│   └── utils/
│       ├── aiEngine.ts            # AI Natural Language Parser, Duplicate Clustering & Categorization
│       ├── searchEngine.ts        # Semantic Keyword & Synonym Search Pipeline
│       ├── dateUtils.ts           # Timezone Snapping & Progress Calculations
│       └── providerManager.ts     # Provider Filtering, Metrics & Conflict Resolution
├── START-WHY-IPTV.bat             # 1-Click Windows Laptop Classroom Launcher
├── STOP-WHY-IPTV.bat              # Safe Process Stopper
├── PRE-PRESENTATION-CHECK.bat     # Pre-Flight Diagnostic Test & CDN Ping Suite
├── test-suite.mjs                 # 556 Automated Unit & Regression Tests (23 Suites)
└── package.json                   # Project Dependencies & Scripts
```

---

## 3. Mandatory Testing Rules for Autonomous Agents
- **Zero Hallucinations**: Never invent streaming URLs or synthesize fake channel rosters.
- **Accurate Sports Mapping**: Ensure sports channels match their real broadcast content (e.g. Bills vs Chiefs on Ch 126, College Football on Ch 108).
- **Automated Verification**: Before committing or pushing, run:
  ```powershell
  npx tsx test-suite.mjs
  npm run build
  ```
  All 556 tests must pass (100% success rate) and Vite production build must complete with zero errors.

---

## 4. One-Click Windows Launching Protocol
On Acer Windows Laptops, launch using:
```cmd
START-WHY-IPTV.bat
```
To safely terminate:
```cmd
STOP-WHY-IPTV.bat
```
