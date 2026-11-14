FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

FROM node:24-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev
EXPOSE 8000
CMD ["node", "dist/index.js"]
