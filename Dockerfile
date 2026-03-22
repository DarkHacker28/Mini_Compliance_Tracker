FROM node:20-alpine

WORKDIR /app

# REPLACE with:
COPY package.json ./
RUN npm install --omit=dev

# Install client dependencies and build
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci

# REPLACE with:
COPY client/package.json ./client/
RUN cd client && npm install

# Copy server code
COPY server/ ./server/

# Seed the database
RUN node server/seed.js

EXPOSE 3001

ENV NODE_ENV=production
CMD ["node", "server/index.js"]
