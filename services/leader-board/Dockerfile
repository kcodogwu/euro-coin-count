FROM node:carbon

WORKDIR /home/kcodogwu/docker/leader-board

# install app dependencies
# a wildcard is used to ensure both pack.json and package-lock.json are copied where available
COPY package*.json ./

RUN npm install

# if for production
# RUN npm install --only=production

# bundle app source
COPY . .

# port for node app
EXPOSE 9004

# port for connecting to redis-server
# EXPOSE 6379

# npm start command
CMD ["npm", "start"]