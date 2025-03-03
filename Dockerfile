# use a official node.js env
FROM node:22-alpine 

# set working directory in container
WORKDIR /app

# copy package.json and package.lock.json to container
COPY package*.json .

# install dependencies 
RUN npm install 

# copy the rest of app
COPY . .

# expose the port 
EXPOSE 5000

# command to run our app
CMD [ "node", "./src/server.js" ]