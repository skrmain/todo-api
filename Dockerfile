FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# ENV NODE_ENV production
# RUN npm ci && npm cache clean --force

RUN npm i

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]
