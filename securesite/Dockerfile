FROM node:10-alpine

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY app.js ./
COPY package.json ./
COPY package-lock.json ./
COPY node_modules/ ./node_modules/
COPY bin/ ./bin/
COPY public/ ./public/
COPY routes/ ./routes/
COPY views/ ./views/

# start app
CMD ["npm", "start"]
