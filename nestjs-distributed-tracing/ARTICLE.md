# Distributed Tracing in NestJS with OpenTelemetry and Jaeger

Distributed tracing is essential for monitoring and debugging microservices architectures. When requests flow through multiple services, understanding the complete request journey becomes challenging without proper observability. This article demonstrates implementing distributed tracing in a NestJS monorepo using OpenTelemetry and Jaeger.

This article provides a walkthrough of the key concepts and implementation highlights rather than a complete step-by-step tutorial. For the full implementation details and complete source code, please refer to the repository:

https://github.com/qaribhaider/tutorials/tree/main/nestjs-distributed-tracing

# Prerequisites

- [Docker compose](https://docs.docker.com/compose/) installed

# Relevant Links

- https://opentelemetry.io/
- https://docs.nestjs.com/

# Setup

This project starts with a [new NestJS application](https://docs.nestjs.com/cli/monorepo#monorepo-mode) called `nestjs-distributed-tracing`, then converts it to a monorepo structure with multiple applications:

- **nestjs-distributed-tracing** - Main HTTP API service
- **http-service-one** - HTTP service
- **the-service-two** - Microservice communicating via RabbitMQ
- **the-service-three** - Another microservice in the chain

## Dependencies

The project uses several key dependencies for configuration, messaging, and tracing:

**NestJS Configuration:**

```bash
npm i --save @nestjs/config
```

**RabbitMQ for Microservices:**

```bash
npm i --save amqplib amqp-connection-manager
```

**OpenTelemetry Dependencies:**

```bash
npm i --save @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express @opentelemetry/instrumentation-fs @opentelemetry/exporter-trace-otlp-http @opentelemetry/auto-instrumentations-node @opentelemetry/instrumentation-amqplib @opentelemetry/instrumentation @opentelemetry/instrumentation-nestjs-core
```

# Implementation

## Service Communication Routes

The main application (`nestjs-distributed-tracing`) exposes several endpoints that demonstrate different communication patterns:

- **GET /** - Simple root endpoint
- **GET /request-response** - Initiates a request-response pattern with Service Two via RabbitMQ, which in turn calls Service Three
- **GET /fire-and-forget** - Sends a fire-and-forget message to Service Two, which in turn calls Service Three
- **GET /outside-call** - Makes an HTTP call to the HTTP Service One

Each route demonstrates how tracing context propagates through different communication mechanisms:

```typescript
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('request-response')
  async requestResponse(): Promise<string> {
    return this.appService.requestResponse();
  }

  @Get('fire-and-forget')
  fireAndForget(): string {
    return this.appService.fireAndForget();
  }

  @Get('outside-call')
  async outsideCall(): Promise<string> {
    return this.appService.outsideCall();
  }
}
```

The service layer handles the actual communication logic:

```typescript
async requestResponse(): Promise<string> {
  try {
    return await firstValueFrom(
      this.serviceTwoClient.send<string>('request_response', {}),
    );
  } catch (error) {
    Logger.error('Error in request-response chain:', error);
    return 'Error in request-response chain';
  }
}

async outsideCall(): Promise<string> {
  try {
    const response = await axios.get<string>(
      'http://host.docker.internal:3003/',
    );
    return response.data;
  } catch (error) {
    Logger.error('Error fetching data:', error);
    throw error;
  }
}
```

## Tracing Configuration

The core of the distributed tracing implementation is the `tracer.helper.ts` file. The file is kept in a shared [NestJS library](https://docs.nestjs.com/cli/libraries).

This must be imported at the very top of each application's `main.ts` file for complete instrumentation:

```typescript
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { Logger } from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

type tracerProperties = {
  serviceName?: string;
};

const tracer = (properties: tracerProperties) => {
  const exporterOptions = {
    url: 'http://dt-jaeger:4317',
  };

  const traceExporter = new OTLPTraceExporter(exporterOptions);

  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: properties.serviceName || 'unknown-service',
    }),
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => Logger.log('Tracing terminated'))
      .catch((error) => Logger.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
};

export { tracer };
```

This tracer helper is then used in each service's `main.ts` file:

```typescript
import { tracer } from '@nestjs-distributed-tracing/helpers';
tracer({ serviceName: 'nestjs-distributed-tracing' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Main application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

The tracer import must be placed before any other imports to ensure proper instrumentation of all modules and dependencies.

# Important Information

## Why RabbitMQ?

RabbitMQ was chosen as the message broker because it properly supports header propagation, which is essential for distributed tracing. OpenTelemetry automatically instruments RabbitMQ connections and ensures that tracing context (trace IDs, span IDs) is passed between services through message headers.

Some message brokers and databases do not support this header propagation out of the box. For example, Redis pub/sub does not automatically propagate tracing headers, making microservice calls invisible in the trace unless manually instrumented. RabbitMQ's built-in support for message properties and headers makes it ideal for maintaining trace continuity across service boundaries.

When a service publishes a message to RabbitMQ, OpenTelemetry automatically injects the current trace context into the message headers. When another service consumes that message, OpenTelemetry extracts the trace context and continues the trace, creating a complete picture of the request flow.

# Run It

To start the entire distributed system with tracing:

```bash
docker compose up --build --remove-orphans
```

This command will:

1. Start Jaeger for trace collection and visualization (accessible at http://localhost:16686)
2. Start RabbitMQ for message brokering (management UI at http://localhost:15672)
3. Build and start all four NestJS applications

Once running, you can test the different communication patterns:

- http://localhost:3000/ - Main application root
- http://localhost:3000/request-response - Test RabbitMQ request-response pattern
- http://localhost:3000/fire-and-forget - Test RabbitMQ fire-and-forget pattern
- http://localhost:3000/outside-call - Test HTTP service communication

Visit the Jaeger UI at http://localhost:16686 to visualize the distributed traces and see how requests flow through your microservices architecture.

Happy coding!
