# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install networking tools (useful for debugging)
RUN apt-get update && apt-get install -y curl iputils-ping && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first (optimized for Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Fix Expo dependencies (optional, only if needed)
RUN npx expo doctor

# Copy the rest of the application code
COPY . .

# Ensure environment variables are available (React Native)
RUN npm install dotenv --save

# Set permissions (optional, prevents permission issues inside containers)
RUN chmod -R 777 /usr/src/app/node_modules

# Expose Expo's default ports
EXPOSE 19000 19001 19002

# Start Expo using NPX and Tunnel mode (allows mobile devices to connect)
CMD ["npx", "expo", "start", "--tunnel"]