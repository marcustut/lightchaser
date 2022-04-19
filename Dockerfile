FROM node:17

WORKDIR /app
COPY . .

RUN yarn && yarn build

EXPOSE ${PORT:-2022}
ENV NODE_ENV=${NODE_ENV:-production}

CMD ["node", "packages/server/dist/index.js"]