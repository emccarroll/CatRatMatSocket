FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install -S multer
RUN mkdir uploads
COPY . .
EXPOSE 3000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && nodemon server