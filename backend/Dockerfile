# Use official Node.js 18.16.1 image as base
FROM node:18.16.1

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# If using bcrypt, rebuild it for the container's environment
RUN npm rebuild bcrypt --build-from-source || true

# Copy the rest of your application code
COPY . .

# Expose the port your app uses (e.g., 3000)
EXPOSE 3000

# Command to start your app
CMD ["npm", "start"]