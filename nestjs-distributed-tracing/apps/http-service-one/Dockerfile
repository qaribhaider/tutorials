FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY apps/http-service-one ./apps/http-service-one
COPY libs ./libs

RUN npm install

EXPOSE 3003

# Start the application in development mode
CMD ["npm", "run", "start:http-service-one:dev"]
