FROM node:20-alpine

WORKDIR /app

# Install root dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Install client dependencies and build
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci
COPY client/ ./client/
RUN cd client && npx vite build

# Copy server code
COPY server/ ./server/

# Seed the database
RUN node server/seed.js

EXPOSE 3001

ENV NODE_ENV=production
CMD ["node", "server/index.js"]
