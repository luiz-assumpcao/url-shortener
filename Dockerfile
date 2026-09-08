FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY db/pool.js ./db/pool.js

EXPOSE 3000

CMD ["node", "src/server.js"]