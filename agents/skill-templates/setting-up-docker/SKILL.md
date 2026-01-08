---
name: setting-up-docker
description: Step-by-step guide for containerizing applications with Docker including Dockerfile creation, docker-compose configuration, and best practices. Use when adding Docker support, creating containers, or containerizing services.
---

# Setting Up Docker

## When to Use This Skill

- Containerizing an application for the first time
- Creating Dockerfile for a service
- Setting up docker-compose for multi-container apps
- Adding Docker to existing projects
- Configuring development and production Docker environments

## Docker Installation Check

**Check if Docker is installed:**
```bash
docker --version
docker-compose --version
```

**If not installed:**
- **Mac/Windows**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: `curl -fsSL https://get.docker.com | sh`

## Step 1: Create Dockerfile

### Language-Specific Templates

#### Python Application

```dockerfile
# Use official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Run application
CMD ["python", "app.py"]
```

#### Node.js Application

```dockerfile
# Use official Node runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

# Run application
CMD ["node", "server.js"]
```

See [more Dockerfile templates](./dockerfiles/) for other languages.

## Step 2: Create .dockerignore

Exclude unnecessary files from Docker context:

```
# .dockerignore
node_modules
npm-debug.log
dist
build
.git
.gitignore
.env
.env.local
*.md
.vscode
.idea
__pycache__
*.pyc
*.pyo
*.pyd
.pytest_cache
.coverage
htmlcov
.DS_Store
Thumbs.db
```

## Step 3: Build and Test Docker Image

```bash
# Build image
docker build -t {{repo_name}}:latest .

# Test locally
docker run -p 8000:8000 {{repo_name}}:latest

# Check logs
docker logs <container_id>

# Enter container shell (for debugging)
docker exec -it <container_id> /bin/sh
```

## Step 4: Create docker-compose.yml

For multi-container applications:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
    command: python app.py
    restart: unless-stopped
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

**Run with docker-compose:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Step 5: Docker Best Practices

### Multi-Stage Builds (Smaller Images)

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Layer Caching Optimization

```dockerfile
# ✅ GOOD: Copy dependencies first (cached if unchanged)
COPY package*.json ./
RUN npm install

# Then copy source code (changes frequently)
COPY . .

# ❌ BAD: Copy everything first (cache invalidated on any change)
COPY . .
RUN npm install
```

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

### Security Best Practices

- ✅ Use official base images
- ✅ Run as non-root user
- ✅ Use specific version tags (not `latest`)
- ✅ Scan images for vulnerabilities: `docker scan {{repo_name}}:latest`
- ✅ Don't include secrets in images (use environment variables)
- ✅ Minimize installed packages

## Step 6: Environment Variables

**Development (.env file):**
```bash
# .env
DATABASE_URL=postgresql://localhost:5432/myapp_dev
API_KEY=dev_key_123
DEBUG=true
```

**Production (use secrets management):**
- Kubernetes Secrets
- Docker Swarm Secrets
- AWS Secrets Manager
- HashiCorp Vault

**Docker compose with .env:**
```yaml
services:
  web:
    env_file:
      - .env
    # Or specify directly
    environment:
      - DATABASE_URL=${DATABASE_URL}
```

## Step 7: Development vs Production

### Development Setup

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app  # Mount source code for hot reload
    ports:
      - "8000:8000"
    environment:
      - DEBUG=true
    command: python manage.py runserver 0.0.0.0:8000
```

### Production Setup

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    environment:
      - DEBUG=false
    # No volume mounts
    # Use secrets for sensitive data
```

**Run specific compose file:**
```bash
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container Exits Immediately

```bash
# Check logs
docker logs <container_id>

# Run interactively to see errors
docker run -it {{repo_name}}:latest /bin/sh
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Use different port
docker run -p 8001:8000 {{repo_name}}:latest
```

### Build Cache Issues

```bash
# Force rebuild without cache
docker build --no-cache -t {{repo_name}}:latest .
```

### Permission Denied

```bash
# Run as root (for debugging only)
docker run -it --user root {{repo_name}}:latest /bin/sh

# Fix ownership
RUN chown -R appuser:appuser /app
```

## Common Commands Reference

```bash
# Images
docker images                    # List images
docker rmi <image_id>           # Remove image
docker prune -a                 # Remove unused images

# Containers
docker ps                       # List running containers
docker ps -a                    # List all containers
docker stop <container_id>      # Stop container
docker rm <container_id>        # Remove container
docker exec -it <id> /bin/sh   # Enter container

# Docker Compose
docker-compose up               # Start services
docker-compose up -d            # Start in background
docker-compose down             # Stop and remove
docker-compose logs -f          # Follow logs
docker-compose ps               # List services
docker-compose restart web      # Restart specific service

# Cleanup
docker system prune             # Remove unused data
docker system prune -a          # Remove all unused data
docker volume prune             # Remove unused volumes
```

## Additional Resources

- [Dockerfile templates](./dockerfiles/) - Language-specific templates
- [docker-compose examples](./compose-examples/) - Multi-container setups
- [CI/CD integration](./ci-integration.md) - Docker in pipelines
- [Kubernetes migration](./k8s-migration.md) - Moving from Docker Compose

## Project Configuration

**Repository:** {{repo_name}}
**Primary language:** {{primary_language}}
**Tech stack:** {{tech_stack}}

Auto-detect Dockerfile from project structure and create appropriate configuration.
