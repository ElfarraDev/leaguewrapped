# Use lightweight Nginx
FROM nginx:alpine

# Copy custom nginx.conf into container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the proxy
EXPOSE 80

# Default command (comes from base image)
CMD ["nginx", "-g", "daemon off;"]
