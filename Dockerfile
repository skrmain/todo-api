FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./

# Local run
FROM base AS local-run
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]


# Build
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build


# Build run
FROM base AS build-run

ENV NODE_ENV production
RUN npm pkg delete scripts.prepare && npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/build ./build
EXPOSE 8000
CMD ["npm", "start"]
