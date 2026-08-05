FROM node:20-slim

# Install LibreOffice and font dependencies for high-fidelity office conversion & sharp image processing
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-liberation \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build TypeScript dist
COPY . .
RUN npm run build

# Create required storage directories for temp uploads and converted outputs
RUN mkdir -p uploads outputs

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
