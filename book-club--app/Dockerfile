# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy only the server directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code (excluding unnecessary files)
COPY server ./

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]
