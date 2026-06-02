# E-Commerce Site with Docker

A complete e-commerce demo built with a React/Vite frontend, Spring Boot backend, and MySQL database—all containerized with Docker Compose.

## Features

- Product catalog with category filtering and search
- Product detail page with image preview
- Add to cart with quantity validation
- Shopping cart management and checkout flow
- Admin product CRUD (create, update, delete)
- Persistent cart state using browser localStorage
- Dockerized frontend, backend, and database services

## Tech stack

- Frontend: React, Vite, Axios, React Router, Bootstrap
- Backend: Spring Boot, Spring Data JPA
- Database: MySQL 8
- Deployment: Docker Compose

## Prerequisites

- Docker installed
- Docker Compose available
- Git (optional, for cloning)

## Environment configuration

This project uses a root `.env` file for Docker Compose and backend settings.

Before running the project, copy the example file or update the existing `.env` values.

```bash
cp .env.example .env
```

### Environment variables

The root `.env` file supports the following variables:

- `MYSQL_ROOT_PASSWORD` — MySQL root password
- `MYSQL_DATABASE` — MySQL database name
- `MYSQL_PORT` — Host port for MySQL
- `BACKEND_PORT` — Host port for backend service
- `FRONTEND_PORT` — Host port for frontend service
- `SPRING_APPLICATION_NAME` — Spring Boot application name
- `SPRING_DATASOURCE_URL` — JDBC URL for MySQL
- `SPRING_DATASOURCE_USERNAME` — MySQL username
- `SPRING_DATASOURCE_PASSWORD` — MySQL password
- `SPRING_DATASOURCE_DRIVER_CLASS_NAME` — JDBC driver class name
- `SPRING_JPA_HIBERNATE_DDL_AUTO` — Hibernate schema strategy
- `SPRING_JPA_SHOW_SQL` — Enable SQL logging
- `VITE_API_BASE_URL` — Frontend API base URL

## Run with Docker

1. Start Docker.
2. From the project root:

```bash
docker compose up -d --build
```

3. Open the app in your browser:

```bash
http://localhost:5173
```

## Restart existing containers

```bash
docker compose start
```

## Stop all services

```bash
docker compose down
```

## Local development notes

### Frontend

If you want to run the frontend outside Docker, point it at the backend API with `VITE_API_BASE_URL`.

```bash
cd frontend-react
npm install
npm run dev
```

### Backend

To run the backend locally:

```bash
cd backend-java
./mvnw spring-boot:run
```

## Useful commands

- Check containers: `docker ps`
- View logs: `docker compose logs -f`
- Rebuild containers: `docker compose up -d --build`

## Notes

- Docker Compose automatically reads the `.env` file from the repo root.
- The frontend uses `VITE_API_BASE_URL` to connect to the backend.
- The backend reads DB credentials from environment variables when running in Docker.
