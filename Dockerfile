FROM node:20-alpine

WORKDIR /app

# Install root dependencies
COPY package.json ./
RUN npm install

# Install client dependencies
COPY client/package.json ./client/
RUN cd client && npm install

# Copy ALL client source and build React app
COPY client/ ./client/
RUN cd client && npm run build

# Copy server code
COPY server/ ./server/

# Copy data folder for SQLite
COPY data/ ./data/

# Seed the database
RUN node server/seed.js

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server/index.js"]
