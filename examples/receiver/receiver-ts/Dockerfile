# Use a Node.js base image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .


# Expose the port your app listens on
EXPOSE 5003

# Start the application
CMD ["yarn", "start"]