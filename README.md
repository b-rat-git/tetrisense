# Tetris for the Lovers
Enjoy Tetris with a little twist.

## Tetrisense – Remote Tetris Control for Lovense Toys

Tetrisense is a browser-based mini‑game that connects to Lovense toys over your local network, originally forked from Lat3xKitty’s Lovense project and extended with remote Tetris control.[file:1][cite:3]  
One person (the **Host**) connects their toys locally, and a second person (the **Player**) gets a code or link to play Tetris; their gameplay triggers vibrations on the Host’s toys in real time.[cite:2][cite:3]

---

### Features

- **Lovense Setup Tab** – Detects your toys via the Lovense LAN API and lets you enable/disable individual devices.[file:1][cite:3]  
- **Tetris Mini‑game** – A simple but spicy Tetris clone with optional **Intense Mode** that scales vibrations with your level and rows cleared.[file:1][cite:2]  
- **Remote Control Mode** – Host/Player roles and connect codes using WebRTC (SimplePeer) so a remote partner’s Tetris performance drives the Host’s toys.[cite:2][cite:3]  
- **Valentines Connect** – A chat‑based mini‑game to send messages and trigger toy patterns for more playful sessions.[file:1][cite:3]

---

### Requirements

- Lovense Connect **mobile app** or **Lovense Desktop** app installed and running.  
- At least one Lovense toy connected and visible in the app.  
- A modern browser (Chrome, Firefox, Edge, Safari).  
- Stable internet connection for both Host and Player.

---

### Getting Started

1. **Clone or download the repo**

   ```bash
   git clone https://github.com/b-rat-git/tetrisense.git
   cd tetrisense
   ```

2. **Open the game**

   - Option 1: Serve the folder with a simple HTTP server and visit `index.html` in your browser.  
   - Option 2: Open `index.html` directly in a browser that allows XMLHttpRequests to the Lovense LAN API.

3. **Start Lovense**

   - Open the **Lovense Connect** mobile app *or* **Lovense Desktop** app.  
   - Enable external control:
     - Mobile: `Me → Settings → Game Mode`.  
     - Desktop: bottom‑left boxes → enable **Allow Control** in the **External Control** menu.[cite:3]

---

### Host Setup (Lovense Owner)

1. Go to the **Setup** tab.  
2. Wait for your toys to appear. Each enabled toy will briefly vibrate when you toggle it on, confirming it’s active.[file:1][cite:3]  
3. Switch to the **Tetris** tab.  
4. Under **Role**, click **I own the Lovense toys (Host)**.  
5. A **Tetris Connect Code** will appear in **Your Connect Code** once the peer connection is initialized.  
6. Click **Copy** and send this code (or a URL that includes it) to your remote partner.

---

### Player Setup (Remote Tetris Partner)

1. Open the same Tetrisense page or the link the Host sends you.  
2. Switch to the **Tetris** tab.  
3. Under **Role**, click **I am the player (Client)**.  
4. Paste the Host’s code into **Peer’s Connect Code** and click **Submit**.  
5. If your browser generates its own Connect Code in **Your Connect Code**, send that back to the Host so they can submit it on their side.  
6. Once both sides have submitted each other’s codes, the data channel will connect and you’re ready to play.

---

### Tetris Controls

- `Left/Right` arrow keys or swipe – Move the piece horizontally.[file:1][cite:2]  
- `Up` arrow or tap – Rotate the piece.[file:1][cite:2]  
- `Space` or swipe down – Hard drop.[file:1][cite:2]  
- `Down` arrow (desktop only) – Soft drop.[file:1][cite:2]  
- `C` (desktop only) – Hold the current piece.[file:1][cite:2]

---

### How Vibrations Work

- **Clearing rows** increases your level and sends vibrations whose intensity scales with:
  - Current level,  
  - Number of rows cleared in that tick,  
  - A small multiplier for extra spice.[cite:2]  
- **Game Over** sends a stronger, short vibration to all enabled toys.[cite:2]  
- **Intense Mode**:
  - When enabled, clearing rows also triggers follow‑up pulses based on the current level, making the game progressively more intense.[cite:2]

All toy control happens on the Host’s side based on the events coming from the Player’s Tetris game.

---

### Safety & Consent

- Only enable toys you actively want tied to the game in the **Setup** tab.  
- Agree on boundaries before starting (Intense Mode, session length, when to pause).  
- The Host can disable toys at any time by toggling them off in **Setup**.  
- If the connection drops, both sides should refresh and re‑exchange Connect Codes.

---

### Troubleshooting

- **No toys found in Setup**  
  - Confirm Lovense Connect or Desktop is open and toys are connected.  
  - Verify that Game Mode / External Control is enabled in Lovense.[cite:3]  
  - Check that you can see your toys at the Lovense LAN `getToys` endpoint as described in `connection.js`.[cite:3]

- **Connect Code doesn’t work**  
  - Make sure you’re pasting the full base64 code with no extra spaces.  
  - Ensure there is exactly **one Host** and **one Player** per session.  

---

### Credits

- Original Lovense mini‑game concept and base code by **Lat3xKitty**.  
- Remote Tetris control and integration tweaks by **b-rat-git** (`tetrisense`).[file:1]
