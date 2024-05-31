# Use the official Node.js 20 image
FROM node:20 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend source code
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight Node.js image for serving
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the build output from the previous stage
COPY --from=build /usr/src/app/build ./build

# Expose port 3000
EXPOSE 3000

# Command to run the frontend server
CMD ["npx", "serve", "-s", "build"]
