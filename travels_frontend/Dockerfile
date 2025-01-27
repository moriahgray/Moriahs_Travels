# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install the new Expo CLI globally
RUN yarn global add @expo/cli

# Copy package.json and yarn.lock into the container
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port for Expo
EXPOSE 19000

# Start the Expo app
CMD ["expo", "start", "--tunnel"]