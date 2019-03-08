FROM node:10.15.1-alpine
LABEL maintainer="shirakiya"

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]
