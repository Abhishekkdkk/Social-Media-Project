# Use stable Node.js LTS version
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Install build tools for packages like bcrypt, sharp, etc.
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of your app
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
