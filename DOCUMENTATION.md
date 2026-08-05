# DocFlow — Complete Project Documentation & Technical Architecture

DocFlow is a full-featured, high-fidelity document conversion, manipulation, and image compression web application equivalent to iLovePDF and SmallPDF.

---

## 📐 1. System Architecture

DocFlow uses a **Dual-Engine Architecture**:
1. **Server-Side High-Fidelity Engine**: Express.js + Node.js with `sharp` for image compression, `pdf-lib` for PDF manipulation, and headless LibreOffice CLI for Office format conversions (`.docx`, `.pptx`, `.xlsx`).
2. **In-Browser Client-Side Engine**: HTML5 Canvas & `pdf-lib` browser fallbacks allowing 100% standalone deployment on **Netlify**, processing files directly inside the user's browser with zero network errors.

```
                  ┌─────────────────────────────────────────┐
                  │            DocFlow Web App              │
                  │   (React + TypeScript + Vite + CSS)     │
                  └────────────────────┬────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
     ┌─────────────────────────────┐       ┌─────────────────────────────┐
     │  In-Browser Client Engine   │       │   Express API Server        │
     │ (HTML5 Canvas / pdf-lib)    │       │ (Sharp / LibreOffice / CLI) │
     └─────────────────────────────┘       └─────────────────────────────┘
```

---

## 🛠️ 2. Included Tools & Capabilities

### 🖼️ Image Tools
- **Image Resizer & KB Compressor** (`/tools/image-resizer`):
  - Compress 3MB+ JPG, PNG, or WEBP photos down to exact target file sizes (**30KB**, **50KB**, **100KB**, **200KB**, **500KB**).
  - Custom width and height pixel scaling.
  - Multi-format export (JPEG, PNG, WEBP).

### 📄 PDF & Office Tools
- **Merge PDF** (`/tools/merge-pdf`): Combine multiple PDF files into one.
- **Split PDF** (`/tools/split-pdf`): Separate a PDF into individual pages or page ranges.
- **Compress PDF** (`/tools/compress-pdf`): Reduce PDF size while preserving layout quality.
- **Word to PDF** (`/tools/word-to-pdf`): Convert DOCX documents into PDF.
- **PPT to PDF** (`/tools/ppt-to-pdf`): Convert PowerPoint presentations into PDF.
- **Excel to PDF** (`/tools/excel-to-pdf`): Convert Excel spreadsheets into PDF.
- **PDF to Word** (`/tools/pdf-to-word`): Convert PDF into editable DOCX.
- **PDF to PPT** (`/tools/pdf-to-ppt`): Convert PDF into PPTX slides.
- **PDF to Excel** (`/tools/pdf-to-excel`): Convert PDF into XLSX tables.
- **Rotate PDF** (`/tools/rotate-pdf`): Rotate PDF pages (90°, 180°, 270°).
- **Watermark PDF** (`/tools/watermark-pdf`): Overlay custom text watermarks.
- **Protect PDF** (`/tools/protect-pdf`): Encrypt PDF with password protection.
- **Unlock PDF** (`/tools/unlock-pdf`): Remove password encryption from PDF.
- **Edit PDF** (`/tools/edit-pdf`): Annotate and stamp text onto PDF pages.

---

## 🎨 3. Design System & Animations

- **Theme Mode Switcher**:
  - **Day Mode ☀️**: Chic aesthetic pastel pink & warm blush palette.
  - **Night Mode 🌙**: Deep midnight berry palette with dark plum surface cards (`#1B0B19` / `#261223`).
- **Interactive Background Layer** (`PokeBackground.tsx`):
  - 3D fluttering butterflies (`@keyframes wingFlapLeft`/`wingFlapRight`).
  - Floating heart and round balloons with swaying strings (`@keyframes balloonRise`).
  - Cute floating teddy bears (`@keyframes bearFloat`).
  - Twinkling 4-point stars (`@keyframes starTwinkle`).
- **Cross-Device Responsiveness**:
  - Seamless layout adaptation for Mobile Phones (<480px), Tablets (480px–768px), Laptops, Desktop PCs, and Macs.
  - Mobile hamburger navigation drawer (`Navbar.tsx`).

---

## 🔒 4. Security & Privacy Features

1. **Magic-Byte File Validation** (`upload-guard.ts`):
   - Sniffs real binary file signatures to detect malicious file extension spoofing for PDF, Office, and Image files.
2. **Automated 1-Hour Purge Worker** (`cleanup-worker.ts`):
   - Background worker deletes uploaded temporary files and output results 1 hour after processing.
3. **Role-Based Access Control (RBAC)**:
   - Supports Guest (Anonymous), Registered User, and Admin accounts.
   - Admin Panel (`/admin`) for user management, plan quotas, usage analytics, audit logs, and global system settings.

---

## 🚀 5. Deployment Options

### A. Render Blueprint Deployment (Render.com)
- **Blueprint File**: `c:\converter\render.yaml` ([render.yaml](file:///c:/converter/render.yaml))
- **Backend Dockerfile**: `c:\converter\backend\Dockerfile` ([backend/Dockerfile](file:///c:/converter/backend/Dockerfile))
- **Deploy Steps**:
  1. Push repository to GitHub.
  2. Log into **[dashboard.render.com](https://dashboard.render.com)**.
  3. Click **New +** → **Blueprint**.
  4. Connect your GitHub repository. Render will automatically detect `render.yaml`, build the Dockerized Express Backend (with Sharp & LibreOffice), and publish the Vite Frontend static site!

### B. Netlify Deployment (Frontend + Client Engine)
- Published Directory: `c:\converter\dist`
- Direct Netlify Drop URL: **[app.netlify.com/drop](https://app.netlify.com/drop)**
- Included Config Files: `_redirects` (`/* /index.html 200`), `netlify.toml`

### C. Local Development
- **Backend Server**: `cd backend && npm run dev` (Runs Express on port `5000`)
- **Frontend Server**: `cd frontend && npm run dev` (Runs Vite on port `3000`)

---

## 🔌 6. API Endpoint Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/image-resizer` | `POST` | Resizes and compresses image to target KB (e.g. 30KB) |
| `/api/merge` | `POST` | Merges multiple PDFs |
| `/api/split` | `POST` | Splits PDF into pages |
| `/api/compress` | `POST` | Compresses PDF file size |
| `/api/convert-office-to-pdf` | `POST` | Converts DOCX/PPTX/XLSX to PDF |
| `/api/convert-pdf-to-office` | `POST` | Converts PDF to DOCX/PPTX/XLSX |
| `/api/rotate` | `POST` | Rotates PDF pages |
| `/api/watermark` | `POST` | Adds text watermark to PDF |
| `/api/protect` | `POST` | Encrypts PDF with password |
| `/api/unlock` | `POST` | Removes password from PDF |
| `/api/edit` | `POST` | Adds annotations/stamps to PDF |
| `/api/auth/login` | `POST` | User authentication |
| `/api/auth/signup` | `POST` | User registration |
