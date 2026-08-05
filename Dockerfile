FROM node:20-slim

# LibreOffice + fonts for Office↔PDF conversion and sharp
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-liberation \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Frontend deps
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Source
COPY shared ./shared
COPY backend ./backend
COPY frontend ./frontend
COPY package.json ./

# Build frontend for same-origin /api, then backend
ENV VITE_API_URL=/api
RUN cd frontend && npm run build
RUN cd backend && npm run build

RUN mkdir -p backend/uploads backend/outputs

ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

WORKDIR /app/backend
CMD ["npm", "start"]
