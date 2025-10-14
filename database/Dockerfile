FROM mongo:8

# Define build arguments
ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD

# Set environment variables from build arguments
ENV MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
ENV MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}

# Expose MongoDB port
EXPOSE 27017

# Use the default MongoDB entrypoint
CMD ["mongod"]