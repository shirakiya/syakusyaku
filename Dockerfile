FROM node:12.14.1-slim
LABEL maintainer="shirakiya"

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY .eslintrc.json .
COPY index.tmpl.html .
COPY webpack.common.js .
COPY webpack.dev.js .
COPY webpack.prd.js .
COPY src ./src
COPY static ./static

CMD ["npm", "start"]
