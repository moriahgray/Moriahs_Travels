# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Upgrade dependencies to their latest versions
RUN npm upgrade

# Copy the rest of the application code
COPY . .

# Expose the port for Expo
EXPOSE 19000

# Set permissions (optional, prevents permission issues inside containers)
RUN chmod -R 777 /usr/src/app/node_modules

# Start the Expo app using npm
CMD ["npm", "start"]