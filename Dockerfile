# Base image
FROM node:20.5.0

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Docker env
ENV DATABASE_HOST=db
ENV DATABASE_PORT=5432
ENV PORT=5000

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]