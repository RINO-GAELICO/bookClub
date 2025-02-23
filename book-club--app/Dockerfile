# Use official Node.js image
FROM node:20

# Install PostgreSQL client (pg_dump)
RUN apt-get update && apt-get install -y postgresql-client

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
