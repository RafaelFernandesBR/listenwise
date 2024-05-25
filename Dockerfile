# Usar uma imagem oficial do Node.js como base
FROM node:latest

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json (se houver)
COPY package*.json ./

# Instalar as dependências da aplicação
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
