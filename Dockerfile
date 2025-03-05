FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

ARG PORT=3000
ENV PORT=$PORT
EXPOSE ${PORT}

CMD ["yarn", "dev"]