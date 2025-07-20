# NestJS Distributed Tracing

This is a NestJS distributed tracing example with a HTTP application and microservices.

## Running the Application

```bash
# Via docker compose
docker compose up --build --remove-orphans
```

## API Endpoints

- `GET http://localhost:3000/`: Main app greeting
- `GET http://localhost:3000/request-response`: Request-response pattern through the service chain
- `GET http://localhost:3000/fire-and-forget`: Fire-and-forget pattern through the service chain
- `GET http://localhost:3000/outside-call`: Makes HTTP call to http-service-one endpoint

## Distributed tracing

- `GET http://localhost:16686/`: Jaeger UI
