FROM node:12.2.0-alpine

# set working directory
WORKDIR /usr/src/app
COPY package*.json ./

# install and cache app dependencies
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install -g nodemon
COPY . .



EXPOSE 8000

# start app
CMD nodemon --exec npm start