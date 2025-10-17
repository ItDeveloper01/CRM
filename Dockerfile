# Use Node image
FROM node:24.5.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install

# Copy the rest of the source
COPY . .

# Set environment variables for React dev server
ENV PORT=4003
ENV HOST=0.0.0.0
ENV HTTPS=false

# Expose the port
EXPOSE 4003

# Start the React dev server
CMD ["npm", "start"]