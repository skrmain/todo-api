FROM node:24-alpine

WORKDIR /app

COPY package.json ./

COPY src .

EXPOSE 8000

CMD ["node", "index.js"]
