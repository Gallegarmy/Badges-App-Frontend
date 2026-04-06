FROM node:25-alpine

WORKDIR /app

COPY . .

EXPOSE 4000

CMD ["npx", "serve","-l", "4000", "."]

