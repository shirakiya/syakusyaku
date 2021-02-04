<p align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/shirakiya/syakusyaku/master/static/logo.png">
</p>

[![CircleCI](https://circleci.com/gh/shirakiya/syakusyaku.svg?style=svg)](https://circleci.com/gh/shirakiya/syakusyaku)

# syakusyaku (尺々)
You can see the distance on Google Maps with Syakusyaku.  
https://syakusyaku.shirakiya.com/


## Requirements
- Node.js >= 12
- Docker / docker-compose
- awscli


## Environment Variables
| Key            | default       | description                                                 |
|----------------|---------------|-------------------------------------------------------------|
| GOOGLE_API_KEY | ''            | for Google Maps                                             |
| GITHUB_TOKEN   | ''            | for Terraform GitHub provider (for deploy)                  |



## SetUp
Build docker image.

```
$ docker-compose build
```


## Run app
This project uses Webpack. In dev, run application with webpack-dev-server.

```
# frontend server
$ docker-compose up

# api server
$ cd api/
$ make start-api
```


## Deploy

- Frontend

Deploy with AWS CodePipeline.  
It hooks the deploy workflow to merge new commits into `production` branch.

- API

Deploy with [serverless-application-model](https://github.com/awslabs/serverless-application-model) (SAM).  
When update API, commands as follows.

```
$ cd api/
$ make package
$ make deploy
```
