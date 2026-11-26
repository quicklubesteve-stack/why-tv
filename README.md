# WHY TV - Modern IPTV & Xtream Codes Web Platform

**WHY TV** is an IPTV web application built with React, TypeScript, Vite, and Tailwind CSS. It supports the current standard IPTV providers and modern user interfaces found on dedicated set-top boxes and streaming hardware (including **TiviMate**, **IPTV Smarters Pro**, and **Classic Cable Box**).

---

## ⚡ Quick Start on Windows (Acer Laptop)

The development server is running locally on port **5180** (to avoid port conflicts):

👉 **[http://localhost:5180/](http://localhost:5180/)**  
*(or `http://127.0.0.1:5180/`)*

### PowerShell Commands:
```powershell
# Open Windows PowerShell in this folder:
cd c:\Users\steve\OneDrive\Desktop\tv

# Start the dev server:
npm run dev

# Or compile production build:
npm run build
npm run preview

# Run the 100% verified test suite (348 tests across 18 suites):
npx tsx test-suite.mjs
```

---

## 📡 Current IPTV Provider Integrations

WHY TV supports the three standard methods used by IPTV providers today:

### 1. Xtream Codes (XC) API Integration
- **Direct Login**: Connect using your provider's **Server URL**, **Username**, and **Password**.
- **Live Metadata**: Fetches account status, expiration date, max connections, server DNS, and provider channel categories.
- **Auto EPG**: Generates the matching `xmltv.php` schedule link automatically.
- **CORS Fallback**: Built-in web CORS proxy toggle for providers that restrict direct browser requests.

### 2. M3U / M3U8 Plus Playlists
- **Remote URL or Local File Upload**: Import standard provider playlists (`get.php?type=m3u_plus&output=m3u8`).
- **File Upload**: Direct file upload completely bypasses browser cross-origin (CORS) blocks.
- **Multiple Named Sources**: Manage multiple providers with independent channel counts and refresh without losing favourites.

### 3. 1-Click Curated Free & FAST Providers
Pre-configured legal public stream bundles ready with 1 click:
- **DAZN, Sportsnet & TSN Live Sports Hub (Phase 5)**: Live sports & regional coverage including Sportsnet East, Sportsnet Ontario, TSN 1 Sports Centre, TSN 4 Action, DAZN Premier League, DAZN Fight Night, NFL RedZone, CBS Sports Golazo, PGA Tour Golf, and Stadium Sports.
- **Pluto TV North America FAST Fleet (Phase 5)**: Curated 24/7 channels featuring Pluto Action Cinema, Pluto Crime Drama, Pluto Retro Classics, Pluto Sci-Fi Nexus, and Pluto Toon Arcade.
- **Canadian Regional Networks (Phase 5)**: CTV National News HD, Global News 24/7 Coast-to-Coast, CBC Regional Newsfeed, and Toronto Metro Cable.
- **IPTV-Org North America**: Public Canadian & US news, regional broadcasts, and educational channels.
- **Cinema 24 FAST Movie Hub**: 24/7 continuous action, sci-fi, classics, and open cinema loops.
- **Global News & Sports 24/7**: Live news & sports feeds (Deutsche Welle, France 24, NASA TV, Red Bull Extreme Sports).

---

## 🖥️ Modern IPTV User Interfaces

You can switch between layouts anytime using the **UI Theme Switcher** in the top navigation bar or **Settings**:

### 1. TiviMate Tri-Pane Layout (Industry Gold Standard)
- **Pane 1 (Category Drawer)**: Quick switching between All, Favourites, Local, Sports, News, Movies, Kids, and Xtream categories with badge counts.
- **Pane 2 (Channels List)**: Channel numbers, high-resolution logos, current show title, and real-time show progress bars.
- **Pane 3 (Live Player & Multi-Hour Timeline)**: Embedded live stream preview, detailed show synopsis, and an upcoming 4-hour program schedule for the selected channel.

### 2. IPTV Smarters Pro Dashboard Hub
- **Modern Tile Grid**:
  - 📺 **LIVE TV** (browse categories & channels)
  - 📅 **TV GUIDE** (EPG schedule)
  - 🔲 **MULTI-SCREEN** (quad-view player)
  - 🎬 **CINEMA & MOVIES** (24/7 movie channels)
  - ⭐ **FAVOURITES** (starred channels)
  - 📡 **XTREAM CODES & CONFIG** (account details & expiration)
- **Account Status Banner**: Displays your active Xtream provider name, server DNS, connection health, and account expiration.

### 3. Multi-Screen (Quad Screen / Split Screen & DAZN / Sportsnet+ Presets)
- Watch **2 or 4 live streams simultaneously** in a clean grid.
- **Sportsnet+ Dual Split Preset**: 1-click preset pairing primary sports (Ch 108) and action sports (Ch 104) in a 2-column side-by-side split.
- **DAZN Quad Matchday Preset**: 1-click preset loading 4 simultaneous sports & racing feeds (Ch 108, Ch 104, Ch 115, Ch 101).
- One-click audio switching between screens so audio never clashes.
- Direct launcher for the **Sports Companion Bar** to track scores alongside multi-game streams.
- Swap channels on any slot or maximize to full screen.

### 4. Netflix & IPTV Smarters Pro On-Demand Entertainment Hub (Phase 6)
- **Dedicated "On Demand" Tab**: Cinematic Netflix-style billboard hero showcasing featured titles with trailer synopsis, cast, director, rating, and 1-click play.
- **Movies & TV Series Carousels**: Browse curated blockbusters (*Tears of Steel*, *Sintel*, *Big Buck Bunny*, *Cyberpunk 2088*, *The Alpine Descent*, *Midnight Noir*) and multi-episode TV series (*Gridiron Dynasties: The Championship Road*, *Orbit Station ISS*, *Forensic Files*).
- **Interactive Episode Picker & Binge Engine**: Browse season episodes with individual runtimes and plot synopses; automatic "Next Episode" prompt and seamless binge progression.
- **Resume Watching & Progress Tracking**: Automatically saves playback timestamps per title and episode to local storage; displays visual progress bars and resume points.
- **VOD Scrub Bar**: Precise seeking, 10-second skip backward (`J` / `◀`), 30-second skip forward (`L` / `▶`), and formatted elapsed/total runtime indicators.

### 5. TV Guide Prime-Time Quick Jump & Category Filters (Phase 6)
- **Timeline Quick Jump Buttons**:
  - `NOW`: Instantly scroll the timeline back to the current live broadcast block.
  - `+2 HOURS`: Jump ahead two hours to check near-future schedules.
  - `🌙 PRIME TIME (8 PM)`: Smart anchor targeting 8:00 PM tonight (or tomorrow if currently past 8:30 PM).
  - `TOMORROW`: Fast-forward to tomorrow morning's programming grid.
- **EPG Category Filter Pills**: 1-click filter pills (`All`, `Sports`, `News`, `Movies`, `Kids`, `Local`) to isolate channels within the timeline guide.
- **Expanded 30-Hour Timeline Grid**: Clean continuous time blocks spanning across prime-time and next-day schedules.

### 6. Audio Sound Mode Equalizer Presets (Phase 6)
- **Dedicated Sound Mode Switcher**: Quick-access audio menu in the video player overlay to adapt acoustic profiles:
  - 🔊 **Standard**: Flat studio reference mix for general TV viewing.
  - 🏟️ **Stadium Mode**: Boosted deep sub-bass (+6.5 dB) and treble (+3.0 dB) for roaring live sports crowd atmospheres and cheering.
  - 🎙️ **Clear Commentary**: Vocal midrange boost (+7.0 dB at 1kHz–3kHz) to cut through background noise and elevate announcer commentary clarity.
  - 🎬 **Cinema Boost**: Expanded dynamic range with punchy low-end (+5.0 dB) and crisp highs (+4.5 dB) for movies and series.

### 7. Live Content & Sports Search Engine (Phase 4)
- **Semantic Live Search**: Search for keywords like **"football"**, **"hockey"**, **"soccer"**, **"chiefs"**, **"leafs"**, or **"news"** to see which channels are broadcasting live games right now.
- **Instant Match & Game Cards**: Displays live scores (e.g. `KC 27 - BUF 24`), current game clock (`4th 02:18`), broadcaster name, and stats snippets.
- **1-Click "Watch Game"**: Clicking any live match or program instantly tunes the player directly into that channel.
- **Trending Search Pills**: 1-click pills for `🏈 Football (Live)`, `🏒 Hockey (NHL)`, `⚽ Soccer`, `🏀 Basketball (NBA)`, `🏎️ Motorsport (F1)`, `📰 Breaking News`, and `🎬 Movies`.
- **Universal Spotlight Overlay**: Press **`/`** from anywhere in the app or tap the **Search** button in the top navigation bar to open the floating quick-search drawer.

### 5. Bell Fibe / Rogers Cloud PVR & Storage Quota Manager (Phase 3)
- **Cloud PVR Management**: Accessible via the **PVR** button in the header, Smarters Pro hub, or player controls.
- **Storage Quota Meter**: Real-time capacity bar (e.g. `14.5 / 100 hrs used (15%)`) following Bell Fibe and Rogers Cloud PVR standards.
- **Scheduled & Instant Recording**: Schedule recordings from the TV Guide ("Record Show") or record live broadcasts directly with the **`R`** shortcut or Record button.
- **Automatic Lifecycle State Machine**: Automatically transitions scheduled shows to recording when air time arrives, and to completed when the program ends.

### 5. Picture-in-Picture (PiP) Floating Player (Phase 3)
- Native HTML5 desktop Picture-in-Picture support accessible via **`P`** shortcut or player controls icon.
- Float your stream above other Windows applications and browser windows while working on your Acer laptop.

### 6. Last Channel Recall / Channel Jump (Phase 3)
- Instant two-way toggle between current and previous channel with the **`L`** key or **Last CH** button (matching the classic "Last" / "Recall" remote button on Bell Fibe TV & Rogers Xfinity remotes).

### 7. Multi-Track Audio & Closed Captions Selector (Phase 3)
- Popover menu in the player overlay to choose from available audio streams (e.g. English, French, Spanish, Stereo) and closed caption subtitle tracks.

### 8. Parental Controls & 4-Digit Security PIN (Phase 3)
- 4-digit PIN challenge modal with keypad and keyboard numbers.
- Lock individual channels or categories (e.g. Adult / Late Night) with instant session unlocking upon entering correct PIN.

### 9. Rogers Xfinity / Sportsnet+ Sports Companion Bar (Phase 2)
- Slide-over live sports drawer accessible via **Trophy icon** in the top navigation, video player overlay, or keyboard shortcut (`S`).
- **Real-Time Scores & Clock Tickers**: Live game tracking for **NHL Hockey** (Leafs vs Canadiens, Oilers vs Flames), **NBA Basketball** (Raptors vs Celtics), **European Soccer** (Arsenal vs Man City, Champions League), and **Motorsport** (F1 lap times and pit deltas).
- **1-Click Tune Broadcast**: Instantly tune directly to the broadcast channel (e.g. Channel 108 Prime Sports Arena) without exiting your current stream.
- **League Filters**: Quick pills for All Leagues, NHL Hockey, NBA Basketball, Soccer, and Motorsport.

### 10. Stream Diagnostics HUD (Phase 1)
- Professional streaming health overlay accessible via `D` key or the **HUD** icon on the player.
- Real-time **Resolution**, **Bitrate** (e.g. 4.5 Mbps), **Buffer Health** (seconds buffered), **Dropped Frames**, and **Audio/Video Codecs**.

### 11. Quick Surfing Mini-Guide (Phase 1)
- Slide-up bottom tray accessible via `G` key or the **Mini-Guide** button while streaming.
- Rapid channel zapping without interrupting video playback.

### 12. Restart TV & Catch-up Timeshift (Phase 1)
- Seamless rewind to the beginning of in-progress shows.
- Automatic timeshift URL generation for Xtream Codes (`/timeshift.php`) and Flussonic (`-timeshift_abs-`).
- Pulsing **GO LIVE** button to snap back to the live broadcast edge.

### 13. Classic Cable Box
- Set-top box lean-back design with high-contrast amber focus glow (`ring-4 ring-amber-400`), live clock in Toronto (ET) or device time, and full-width TV guide.

---

## 🎮 Remote & Keyboard Navigation

WHY TV is optimized for 10-foot remote and laptop keyboard navigation:

| Key | Action |
| :--- | :--- |
| **Arrow Keys (▲ ▼ ◀ ▶)** | Navigate focus ring across channels, categories, and guide cells |
| **Enter / Space** | Tune channel, select button, or toggle play/pause |
| **0 – 9 (Numeric Keys)** | Direct Cable Channel Dialing (dial e.g. `101` to tune to CH 101) |
| **/** | Universal Quick Search (search "football", live games, channels) |
| **L** | Last Channel Recall (toggle back and forth to previous channel) |
| **P** | Picture-in-Picture (PiP floating mini-player) |
| **R** | Instant Record live broadcast to Cloud PVR |
| **S** | Toggle Sports Companion Bar (live scores & game tracker) |
| **D** | Toggle Stream Diagnostics HUD (bitrate, buffer, resolution) |
| **G** | Toggle Quick Surfing Mini-Guide drawer |
| **Escape / Backspace** | Exit fullscreen, dismiss drawers, or return to Home |
| **Mouse / Touchpad** | Full mouse and touchscreen support |

---

## 🛠️ Browser Notes & Troubleshooting

- **CORS Restrictions**: If a provider stream or playlist gives a CORS error, turn on the **CORS Proxy Fallback** toggle in Settings or use the **Upload .M3U File** button.
- **Mixed Content**: The app runs locally on `http://localhost:5180/`, which allows streaming both HTTP and HTTPS streams without mixed-content browser blocks.
- **Audio Auto-Play**: Web browsers require one user click or keypress before playing unmuted audio.
