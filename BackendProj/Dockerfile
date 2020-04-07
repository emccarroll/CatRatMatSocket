FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ADD . .
EXPOSE 3000
CMD [ "node", "server.js" ]