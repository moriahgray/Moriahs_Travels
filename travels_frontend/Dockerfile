# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install the new Expo CLI globally
RUN yarn global add @expo/cli

# Debug: Verify global installation of @expo/cli
RUN yarn global list

# Copy package.json and yarn.lock into the container
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Debug: Check for node_modules after installation
RUN ls -la node_modules

# Copy the rest of the application code
COPY . .

# Expose the port for Expo
EXPOSE 19000

# Start the Expo app using yarn
CMD ["yarn", "start"]