#!/bin/sh

# Decode and write the service account JSON key to a file
echo "$GOOGLE_APPLICATION_CREDENTIALS_CONTENT" | base64 --decode > /tmp/gcp-key.json

# Set the environment variable to point to this file
export GOOGLE_APPLICATION_CREDENTIALS="/tmp/gcp-key.json"

# Debugging: Check if the file exists and print first 10 lines
ls -lah /tmp/gcp-key.json
head -n 10 /tmp/gcp-key.json

# Start the app
exec npm start
