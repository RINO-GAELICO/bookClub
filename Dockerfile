# Use the official Node.js image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the correct directory
COPY book-club-app/server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend application code from the correct directory
COPY book-club-app/server/ ./

# Expose the necessary port (if any)
EXPOSE 5000

# Start the application with a script
CMD ["/bin/sh", "-c", "echo \"$GOOGLE_APPLICATION_CREDENTIALS_CONTENT\" | base64 --decode > /tmp/gcp-key.json && export GOOGLE_APPLICATION_CREDENTIALS='/tmp/gcp-key.json' && npm start"]

