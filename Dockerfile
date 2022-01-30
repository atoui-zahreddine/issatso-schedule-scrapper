FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV NODE_ENV production
ENV PORT 8080
ENV DB_URL ${DB_URL}
CMD ["npm", "start"]
