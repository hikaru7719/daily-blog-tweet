FROM node:14.5.0
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build
CMD node dist/index.js
