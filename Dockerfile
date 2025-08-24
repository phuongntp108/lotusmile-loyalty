FROM node:18-alpine

RUN apk add --no-cache openssl bash

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client (trong cùng stage runtime)
RUN npx prisma generate

# Build Next.js app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
