FROM node:latest
WORKDIR /src
ADD ./src/ /src/
RUN npm install -g nodemon
RUN npm install
CMD ["node", "/src/index.js"]