FROM node:21-slim

RUN apt update && apt install -y openssl procps

RUN npm install -g @nestjs/cli@10.3.2 

WORKDIR /home/node/app

# copiar package.json antes (melhor cache)
COPY package*.json ./

# instalar dependências
RUN npm install

# copiar código restante
COPY . .

# gerar prisma client
RUN npx prisma generate

RUN chown -R node:node /home/node/app

# mudar para usuário node
USER node

# rodar migrations e subir o NestJS
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
