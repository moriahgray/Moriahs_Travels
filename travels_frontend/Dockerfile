# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Upgrade dependencies to latest Expo version
RUN npx expo install --fix

# Copy the rest of the application code
COPY . .

# Expose Expo's default ports
EXPOSE 19000 19001 19002

# Set permissions (optional, prevents permission issues inside containers)
RUN chmod -R 777 /usr/src/app/node_modules

# Start Expo using NPX and Tunnel mode
CMD ["npx", "expo", "start", "--tunnel"]