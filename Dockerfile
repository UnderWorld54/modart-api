FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Rendre le script exécutable
RUN chmod +x docker-entrypoint.sh

EXPOSE 8080

CMD ["sh", "docker-entrypoint.sh"] 