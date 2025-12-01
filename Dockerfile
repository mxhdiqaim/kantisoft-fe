FROM node:20-alpine AS Build

ARG VITE_APP_API_URL

WORKDIR /app

# Enable corepack to use pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./


# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# Pass the build argument as an environment variable during the build process
RUN VITE_APP_API_URL=${VITE_APP_API_URL} pnpm build

## Build the application for production.
#RUN pnpm build

# Serve the application with a lightweight Nginx server
FROM nginx:alpine AS serve

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the build stage to the Nginx public directory
COPY --from=Build /app/dist /usr/share/nginx/html

# Expose port 80 to the host machine
EXPOSE 80, 3000

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]