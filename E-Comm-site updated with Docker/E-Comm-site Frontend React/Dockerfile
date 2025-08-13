# Use Node.js LTS
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
