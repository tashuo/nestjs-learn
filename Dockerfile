FROM node:18.16.0-alpine

RUN apk add --no-cache bash
RUN npm i -g pnpm @nestjs/cli typescript ts-node@latest

COPY package*.json /tmp/app/
RUN cd /tmp/app && pnpm i

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

WORKDIR /usr/src/app
RUN ts-node -v
RUN cp .env.example .env
RUN pwd
RUN ls -al src/database
RUN ts-node ./node_modules/typeorm/cli -d ./src/database/typeorm.config.ts migration:run
RUN pnpm build

CMD ["pnpm", "start:prod"]