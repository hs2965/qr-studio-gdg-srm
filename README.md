# QR Studio – QR Code Generator & Designer

> **"Create. Customize. Scan."**  
> Built for the **GDG on Campus SRM Technical Domain Recruitment 2026-27** submission.

---

## 1. Project Title & Overview
**QR Studio** is a modern, high-performance, client-side web application designed to generate, style, and diagnose QR codes in real-time. Designed according to clean UI/UX standards, the application works entirely within the browser without requiring any server-side processing, database, authentication, or external backend.

---

## 2. Project Description
QR Studio provides a seamless, zero-latency dashboard interface for creating standard-compliant QR codes. Users can select from 5 standard QR types, customize color schemes, margins, sizes, and fault tolerance levels, and immediately preview their designs. A built-in **Scan Reliability Engine** audits color contrast and quiet zone geometries to help ensure codes remain scannable on smartphone cameras before downloading.

---

## 3. Key Features
- **Real-Time Live Generation**: Instant canvas updates on keystrokes and slider adjustments without requiring a manual "Generate" button.
- **5 Standard QR Types**: URL, Plain Text, Email (mailto), Phone Number (tel), and Wi-Fi network configuration.
- **Deep Visual Customization**: Custom sizing (160px–600px slider range, up to 640px via direct input), hex/color pickers, 4 error-correction levels, and module margins.
- **6 Built-in Design Presets**: One-click colorways that can be freely tweaked after applying without locking the controls.
- **Real-Time Scan Reliability Engine**: Evaluates WCAG 2.1 relative luminance optical contrast and quiet zones to alert users to low-contrast combinations.
- **Browser LocalStorage History**: Automatically preserves up to 10 recent QR codes across page refreshes with full configuration restoration.
- **Multi-Format Export**: High-resolution PNG download, scalable Vector SVG export, and 1-click clipboard image copy.
- **Light & Dark Mode**: Native persistent theme switching stored in browser localStorage.
- **Zero Backend Footprint**: 100% private, client-side execution suitable for static hosting on Vercel, Netlify, or GitHub Pages.

---

## 4. Supported QR Types

| QR Type | Format Standard | Required Inputs & Validation |
| :--- | :--- | :--- |
| **URL** | RFC 3986 Standard | Formatted web URL (e.g., `https://example.com`); auto-prepends protocol if missing. |
| **Plain Text** | Raw UTF-8 string | Arbitrary notes, addresses, codes, or instructions. Validates against empty input. |
| **Email** | RFC 5322 Mailto schema | Recipient email, optional subject line, and pre-populated message body. |
| **Phone Number** | RFC 3966 `tel:` URI | Valid telephone number with country code support. |
| **Wi-Fi** | ZXing Wi-Fi schema | Network SSID, Security protocol (`WPA/WPA2`, `WEP`, `None`), password, and hidden network flag. |

---

## 5. Customization Features
Users can modify the following QR attributes with immediate live feedback:
1. **QR Code Size**: Dual slider (160px–600px) and numerical pixel input (up to 640px) for both digital display and physical printing.
2. **Foreground Color**: Full RGB color picker, uppercase hex code input, and curated contrast swatches.
3. **Background Color**: Background canvas color picker with hex input and swatches.
4. **Error Correction Level**:
   - **L (Low)**: ~7% damage recovery (cleanest module density)
   - **M (Medium)**: ~15% recovery (recommended standard)
   - **Q (Quartile)**: ~25% recovery (ideal for high-wear environments)
   - **H (High)**: ~30% recovery (maximum durability)
5. **Quiet Zone Margin**: Configurable padding from 0 to 6 modules to ensure optical separation.

---

## 6. Design Presets
Includes 6 pre-configured visual schemes:
- **Classic Monochrome**: Standard `#000000` on `#ffffff` (Medium EC).
- **High Contrast Pro**: Midnight slate `#090d16` on pure `#ffffff` with High EC (Level H).
- **Dark Slate**: Modern dark-mode palette (`#f8fafc` on `#0f172a`).
- **Soft Forest**: Natural emerald `#064e3b` on soft mint `#ecfdf5`.
- **Cobalt Blue**: Tech navy `#1e3a8a` on ice blue `#eff6ff`.
- **Warm Espresso**: Deep roasted amber `#451a03` on golden cream `#fef9c3`.

*Note: Selecting a preset does not lock the interface. All individual sliders and color inputs remain fully adjustable.*

---

## 7. Input Validation & Error Handling
- **Real-Time Validation**: Evaluates form data on change and displays clear, context-specific error banners.
- **Empty State Preventions**: Disables export actions and renders an intuitive empty state when mandatory fields are missing.
- **No Blocking Alerts**: Replaces intrusive browser `alert()` popups with inline field highlights and accessible alert regions.
- **Wi-Fi Password Rules**: Enforces mandatory password validation for WPA/WPA2 (minimum 8 characters) while permitting open networks.

---

## 8. Scan Reliability Diagnostics
To evaluate real-world physical and digital scannability, QR Studio features an automated diagnostic system:
- **WCAG 2.1 Optical Contrast Calculation**: Computes the exact relative luminance ratio between foreground and background colors.
- **Low Contrast Detection**: Warns the user if the contrast ratio falls below 4.0:1 or is dangerously low (< 2.5:1).
- **Inverted Color Scheme Warnings**: Alerts when foreground modules are lighter than the background, which causes failures on older CMOS scanner hardware.
- **Quiet Zone Detection**: Warns when margin is set to 0 or 1, preventing pattern cropping during printing.
- **1-Click Auto-Fix**: Provides a quick action to instantly correct colors to an optimal 21:1 contrast ratio.

---

## 9. Recent QR Codes & LocalStorage
- **Persistent Storage**: Utilizes browser `localStorage` (`qr_studio_recent_history_v1`) to persist up to 10 recent QR designs across sessions and page refreshes.
- **Complete State Snapshot**: Saves type, input form data, customization settings, timestamps, and thumbnail data URLs.
- **"Use Again" / Load**: Restores all inputs and settings to the active editor with one click.
- **Corruption Resilience**: Includes try/catch parsing guards and schema validation to handle empty or damaged storage without crashing.
- **History Management**: Allows removing individual items or clearing all history.

---

## 10. Responsive Design
- **Desktop (>= 1024px)**: Ergonomic 2-column dashboard layout with scrollable inputs and a sticky preview/actions sidebar.
- **Tablet (768px – 1023px)**: Adaptive grid with preserved proportions and accessible touch targets.
- **Mobile (< 768px)**: Fluid vertical stack with centered preview, overflow-safe inputs, and $\ge 44\text{px}$ touch targets.

---

## 11. Technologies Used
- **React 19**: Modern functional component architecture with hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`).
- **TypeScript**: Complete type safety and domain interfaces.
- **Tailwind CSS v4**: Utility-first styling with dark mode support and responsive breakpoints.
- **qrcode**: Industry-standard client-side QR generation engine.
- **Lucide React**: Clean, accessible iconography.

---

## 12. Installation Instructions
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/hs2965/qr-studio-gdg-srm.git

# Navigate into project directory
cd qr-studio-gdg-srm

# Install dependencies
npm install
```

---

## 13. How to Run Locally

The development server is configured to run on port 3000 via Vite (`vite --port=3000 --host=0.0.0.0`):

```bash
# Start the Vite development server on port 3000
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 14. How to Build for Production

```bash
# Validate TypeScript types and compile static production bundle
npm run build
```

The compiled static assets will be output to the `dist/` directory.

---

## 15. Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your `qr-studio-gdg-srm` repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

### Deploy to Netlify
1. Connect your GitHub repository on [Netlify](https://netlify.com).
2. Set Build Command: `npm run build`.
3. Set Publish Directory: `dist`.
4. Click **Deploy Site**.

---

## 16. Screenshots & Visual Previews

### Interface Layout Overview
```
+--------------------------------------------------------------------------------+
|  QR Studio   [Generator]  [Customization]  [Presets]  [Recent (3)]     [Dark]  |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [ URL | Plain Text | Email | Phone | Wi-Fi ]     +--------------------------+ |
|                                                   |  LIVE PREVIEW            | |
|  Website URL: [ https://gdgsrm.org        ]       |  +--------------------+  | |
|                                                   |  |   [QR CANVAS]      |  | |
|  Design Presets:                                  |  +--------------------+  | |
|  [Classic] [High Contrast] [Dark] [Forest] ...    |  Scan Reliability: OK    | |
|                                                   |  Contrast: 18.2:1        | |
|  Customization:                                   |                          | |
|  Size: [==========o=====] 280px                   |  [ Download PNG ]        | |
|  Colors: [ #0f172a ]  [ #ffffff ]                 |  [ Vector SVG ] [ Copy ] | |
|  Margin: [======o=======] 3 modules               +--------------------------+ |
|  Error Correction: [L] [M] [Q] [H]                                             |
+--------------------------------------------------------------------------------+
|  How QR Studio Works: [1] Choose Type [2] Enter Info [3] Customize ...         |
+--------------------------------------------------------------------------------+
|  Recent QR Codes History (survives page refresh)                               |
+--------------------------------------------------------------------------------+
```

> **Note on Screenshots**: Actual screenshots will be added manually to the repository under `docs/screenshots/` after local execution and testing.
>
> Planned screenshot locations:
> - `docs/screenshots/01-desktop-overview.png` – Desktop 2-column layout and live preview
> - `docs/screenshots/02-customization-presets.png` – Visual presets and customization controls
> - `docs/screenshots/03-scan-reliability-warning.png` – Real-time contrast & scan reliability diagnostics
> - `docs/screenshots/04-recent-history-mobile.png` – Recent QR history cards and mobile responsive view

---

## 17. Comprehensive Testing Checklist

### QR Types Validation & Rendering
- [x] **URL Type**: Generates valid RFC 3986 links; verifies empty URL error handling.
- [x] **Plain Text Type**: Supports arbitrary characters, unicode, and multi-line notes.
- [x] **Email Type**: Validates email syntax, compiles `mailto:user@host?subject=...&body=...`.
- [x] **Phone Type**: Validates international phone formatting and generates `tel:...`.
- [x] **Wi-Fi Type**: Generates standard `WIFI:T:WPA;S:...;P:...;;` strings with hidden network support.

### Customization & Reliability
- [x] **Size Slider**: Live canvas scaling across 160px–600px (slider range) and up to 640px (numerical input).
- [x] **Colors**: Real-time foreground and background color changes.
- [x] **Margin**: 0 to 6 quiet zone module spacing.
- [x] **Error Correction**: Live toggling of L (7%), M (15%), Q (25%), and H (30%).
- [x] **Presets**: Immediate application of preset styles without locking manual controls.
- [x] **Contrast Audit**: Accurately flags ratios under 4:1 and inverted color combinations.

### Storage & Export
- [x] **PNG Export**: Downloads valid PNG matching current preview dimensions and colors.
- [x] **SVG Export**: Downloads scalable vector graphics.
- [x] **LocalStorage Persistence**: History persists after hard page reload (`Ctrl+F5`).
- [x] **State Restoration**: "Use Again" correctly populates inputs, type, and sliders.

---

## 18. Known Limitations & Architecture Notes
- **Browser-Only Execution**: All operations occur client-side in the user's browser; no external server is contacted.
- **LocalStorage Capacity**: Browser localStorage typically allows ~5MB of storage, which is more than sufficient for storing 10 metadata snapshots with compressed thumbnails.

---

## 19. Author & Recruitment Submission
- **Applicant**: GDG on Campus SRM Technical Domain Candidate
- **Institution**: SRM Institute of Science and Technology
- **Academic Year**: 2026-27
