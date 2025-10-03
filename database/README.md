# MongoDB Docker Setup

## Quick Start

```bash
# From the project root directory (edurod/)
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# Access MongoDB shell
docker-compose exec mongodb mongosh -u adminedurod -p edurodpassword2025

# View logs
docker-compose logs mongodb
```

## Commands

-   `docker-compose up -d` - Start MongoDB in detached mode
-   `docker-compose down` - Stop and remove containers
-   `docker-compose down -v` - Stop and remove containers with volumes (deletes data)
-   `docker-compose restart` - Restart MongoDB service

## Connection Details

-   **Host**: localhost
-   **Port**: 27017
-   **Username**: admin
-   **Password**: admin
-   **Connection String**: `mongodb://admin:admin@localhost:27017/`
