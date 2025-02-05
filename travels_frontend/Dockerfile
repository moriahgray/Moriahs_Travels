# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Debug: Verify global installation of @expo/cli
RUN yarn global list

# Copy package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies and upgrade packages
RUN yarn install && yarn upgrade

# Debug: Check for node_modules after installation
RUN ls -la node_modules

# Copy the rest of the application code
COPY . .

# Expose the port for Expo
EXPOSE 19000

# Ensure permissions (optional, prevents permission issues inside containers)
RUN chmod -R 777 /usr/src/app/node_modules

# Start the Expo app using yarn
CMD ["yarn", "start"]