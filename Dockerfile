FROM node:10.15.3-alpine
LABEL maintainer="shirakiya"

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]
