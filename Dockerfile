FROM node:10.14.1-alpine
LABEL maintainer="shirakiya"

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]
