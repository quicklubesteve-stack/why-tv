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
- **IPTV-Org North America**: Public Canadian & US news, regional broadcasts, and educational channels (CBC, CTV, Citytv, PBS, ABC News, etc.).
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

### 3. Multi-Screen (Quad Screen / Split Screen)
- Watch **2 or 4 live streams simultaneously** in a clean grid.
- One-click audio switching between screens so audio never clashes.
- Swap channels on any slot or maximize to full screen.

### 4. Classic Cable Box
- Set-top box lean-back design with high-contrast amber focus glow (`ring-4 ring-amber-400`), live clock in Toronto (ET) or device time, and full-width TV guide.

---

## 🎮 Remote & Keyboard Navigation

WHY TV is optimized for 10-foot remote and laptop keyboard navigation:

| Key | Action |
| :--- | :--- |
| **Arrow Keys (▲ ▼ ◀ ▶)** | Navigate focus ring across channels, categories, and guide cells |
| **Enter / Space** | Tune channel, select button, or toggle play/pause |
| **0 – 9 (Numeric Keys)** | Direct Cable Channel Dialing (dial e.g. `101` to tune to CH 101) |
| **Escape / Backspace** | Exit fullscreen, dismiss dialogs, or return to Home |
| **Mouse / Touchpad** | Full mouse and touchscreen support |

---

## 🛠️ Browser Notes & Troubleshooting

- **CORS Restrictions**: If a provider stream or playlist gives a CORS error, turn on the **CORS Proxy Fallback** toggle in Settings or use the **Upload .M3U File** button.
- **Mixed Content**: The app runs locally on `http://localhost:5180/`, which allows streaming both HTTP and HTTPS streams without mixed-content browser blocks.
- **Audio Auto-Play**: Web browsers require one user click or keypress before playing unmuted audio.
