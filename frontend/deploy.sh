#!/bin/bash

# Set variables
FRONTEND_DIR=$(pwd)
BACKEND_DIR=$(realpath ../backend)
PUBLIC_DIR="$BACKEND_DIR/public"

# Display current directories
echo "Frontend directory: $FRONTEND_DIR"
echo "Backend directory: $BACKEND_DIR"
echo "Public directory: $PUBLIC_DIR"

# Step 1: Build the React app
echo "Building frontend..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed! Exiting."
  exit 1
fi

# Step 2: Ensure the backend public directory exists
echo "Ensuring backend public directory exists..."
mkdir -p "$PUBLIC_DIR"

# Step 3: Clear any existing files in the public directory
echo "Clearing existing files in public directory..."
rm -rf "$PUBLIC_DIR"/*

# Step 4: Copy the build files to the backend public directory
echo "Copying build files to backend public directory..."
cp -R "$FRONTEND_DIR/dist"/* "$PUBLIC_DIR"

# Step 5: Verify the files were copied
echo "Verifying files were copied..."
ls -la "$PUBLIC_DIR"

# Step 6: Success message
echo "Deployment complete! The frontend has been built and deployed to the backend."
echo "You can access it by running the backend server." 