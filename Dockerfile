FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV production
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
