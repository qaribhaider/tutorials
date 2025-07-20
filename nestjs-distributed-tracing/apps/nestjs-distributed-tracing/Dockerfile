FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY apps/nestjs-distributed-tracing ./apps/nestjs-distributed-tracing
COPY libs ./libs

RUN npm install

EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:main:dev"]
