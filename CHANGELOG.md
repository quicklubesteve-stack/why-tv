# Changelog - WHY IPTV Academic Capstone Prototype

All notable changes to the WHY IPTV project are documented in this file.

## [v1.0.0-academic] - 2026-11-27
### Added
- **Full Television Guide Redesign**: TiviMate-inspired dark navy (`#10151F`), menu (`#1B2432`), and electric blue (`#42AAFF`) interface with real-time red vertical clock indicator (`#EF4444`).
- **Large Embedded Live Preview**: Embedded HLS live stream player above horizontal EPG with metadata card, next-programme preview, streaming diagnostics, and single/double-click fullscreen toggle.
- **Permanent Collapsible Left Navigation**: 19 categories (All Channels, Favourites, Canadian Channels, American Channels, Live Sports, NHL, NFL, NBA, MLB, UFC and Boxing, Movies, Television Series, News, Kids, International, Pluto TV, Plex, Other Connected Providers, Settings).
- **104 Authorized Working Channels**: Aggregated across 18 verified providers (CBC Gem, Pluto TV, Plex Live TV, Samsung TV Plus, LG Channels, Xumo Play, The Roku Channel, VMedia, TekSavvy, Amagi, Wurl, Frequency, DAZN, Sportsnet+).
- **WHY-AI Semantic Discovery Engine**: Zero-hallucination natural language assistant answering all 7 academic evaluation queries with explainable reasoning and 1-click live stream tuning.
- **AI Duplicate Channel Detection**: Multi-provider clustering algorithm identifying overlapping channel feeds and selecting highest-bitrate source.
- **AI Machine Learning Categorization**: Automated taxonomy classifier tagging unstructured EPG metadata with genre, language, and regional tags.
- **Classroom Demonstration Mode**: Dedicated presentation banner, preconfigured favourites, streaming HUD, and offline Wi-Fi backup simulation ensuring seamless classroom presentation.
- **Working Provider Dashboard**: Operational controls for Add Provider, Test Connection, Import Channels, Synchronize Programme Guide, Validate Channels, and Refresh Providers.
- **Academic Project Dossier**: Interactive in-app capstone report covering Problem, Solution, AI Algorithms, Business/Licensing Feasibility, and Architecture Diagram.
- **One-Click Windows Automation**: `START-WHY-IPTV.bat`, `STOP-WHY-IPTV.bat`, and `PRE-PRESENTATION-CHECK.bat` for seamless execution on Acer Windows laptops.

### Fixed
- **Accurate Sports Stream Binding**: Repaired sports tuning so selecting the Buffalo Bills vs Kansas City Chiefs game on Ch 126 correctly plays the live NFL football feed rather than college football or unrelated programming.
- **EPG Clock Line Position**: Aligned continuous red vertical time indicator across all channel rows.
- **Keyboard & Remote Navigation**: Full television remote D-pad arrow key support, Enter to tune/fullscreen, Esc/Backspace to return, and M to toggle navigation menu.

### Verified
- **556 / 556 Automated Unit & Regression Tests Passing (100%)** across 23 comprehensive test suites.
- **Zero-error TypeScript & Vite production build**.
