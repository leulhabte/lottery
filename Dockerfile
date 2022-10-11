FROM node:16.17-buster

RUN apt-get update

RUN apt-get install -y build-essential

WORKDIR /app

ADD package.json yarn.lock /app/

RUN yarn

COPY . /app/

EXPOSE 5000

CMD ["yarn", "start"]