#!/bin/bash

# Set environment variables
BACKUP_DIR=backup-folder
DB_NAME=bookclub
DB_USER=bookclub_user
DB_PASSWORD=secretpassword
DB_HOST=db
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${DATE}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Export the password (pg_dump needs this)
export PGPASSWORD=$DB_PASSWORD

echo "Starting backup..."
echo "Using database: $DB_NAME, user: $DB_USER, host: $DB_HOST"

# Create the backup using pg_dump
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f $BACKUP_FILE

# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Backup successfully saved to $BACKUP_FILE"
else
  echo "Error: Backup failed"
fi

# Clean up (remove password from env variables)
unset PGPASSWORD