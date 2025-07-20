FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY apps/the-service-three ./apps/the-service-three
COPY libs ./libs

RUN npm install

# Start the application in development mode
CMD ["npm", "run", "start:service-three:dev"]
