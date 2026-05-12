# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy source code and build
COPY client/ .
RUN npm run build

# Stage 2: Build the Express backend
FROM node:20-alpine AS backend-builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy backend dependencies
COPY --from=backend-builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy backend source code
COPY server/ ./server/

# Copy built frontend from Stage 1 into the location expected by Express
# In server.js, app.use(express.static(path.join(__dirname, '../client/dist'))) is used for production
COPY --from=frontend-builder /app/client/dist ./client/dist

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
