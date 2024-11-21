# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
COPY .env .env

RUN npm run build
# RUN npm prune --production

FROM node:18-alpine
WORKDIR /app
# Ensure the temporary directory exists and has proper permissions
RUN mkdir -p /tmp/uploads && chmod -R 777 /tmp/uploads
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
COPY .env .env

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]