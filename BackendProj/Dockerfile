FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && nodemon server