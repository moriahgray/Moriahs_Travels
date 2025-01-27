# Use the official Node.js image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Expo CLI globally
RUN npm install -g expo-cli

# Copy package.json and yarn.lock into the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port for React Native (Expo)
EXPOSE 19000

# Start the Expo app
CMD ["expo", "start", "--tunnel"]