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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
