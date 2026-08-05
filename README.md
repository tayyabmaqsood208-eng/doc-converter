# DocFlow — Professional PDF Tools Suite & Image Compression Platform

DocFlow is a full-featured, high-fidelity document conversion, manipulation, and image compression web application equivalent to iLovePDF and SmallPDF.

---

## ✨ Key Features

- **Image Resizer & KB Compressor**: Compress 3MB+ photos down to **30KB**, **50KB**, **100KB**, **200KB**, **500KB** or custom pixel dimensions.
- **14 Essential PDF & Office Tools**: Merge, Split, Compress, Word ↔ PDF, PPT ↔ PDF, Excel ↔ PDF, Rotate, Watermark, Protect, Unlock, and Edit PDF.
- **Cute Animated Background**: Floating 3D fluttering butterflies, rising heart balloons, teddy bears, and twinkling stars.
- **Day ☀️ & Night 🌙 Mode**: Seamless theme switcher supporting dark mode cards and glowing typography.
- **100% Netlify Compatible**: Dual-engine architecture featuring in-browser client-side fallback for Netlify standalone deployment.
- **Security & Privacy**: Client and server-side magic-byte file signature validation (`upload-guard.ts`) and automatic 1-hour retention cleanup worker (`cleanup-worker.ts`).

---

## 📁 Repository Structure

- `/frontend`: React + TypeScript + Vite web app with custom CSS design tokens (`design-tokens.css`).
- `/backend`: Express.js + TypeScript server with `sharp`, `pdf-lib`, LibreOffice CLI integration, and temp file retention store.
- `/dist`: Production build output directory configured with `_redirects` and `netlify.toml` for 1-click Netlify deployment.
- `DOCUMENTATION.md`: Full technical architecture documentation and API specification.

---

## 🚀 Quick Start

### 1. Local Development

- **Backend API Server**:
  ```bash
  cd backend
  npm install
  cmd.exe /c "npm run dev"
  ```
  *Server running at [http://localhost:5000](http://localhost:5000)*

- **Frontend Web App**:
  ```bash
  cd frontend
  npm install
  cmd.exe /c "npm run dev"
  ```
  *Web interface running at [http://localhost:3000](http://localhost:3000)*

### 2. Live Netlify Deployment

1. Open **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag and drop the folder **`dist/`** ([c:/converter/dist](file:///c:/converter/dist)).
3. Your site will instantly be published live!

---

## 📖 Complete Technical Documentation

For complete API specifications, security models, and system architecture details, see [DOCUMENTATION.md](file:///c:/converter/DOCUMENTATION.md).
