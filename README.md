<p align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/shirakiya/syakusyaku/master/static/logo.png">
</p>

[![CircleCI](https://circleci.com/gh/shirakiya/syakusyaku.svg?style=svg)](https://circleci.com/gh/shirakiya/syakusyaku)

# syakusyaku (尺々)
You can see the distance on Google Maps with Syakusyaku.


## Requirements
- Node.js >= 10.15
- Docker / docker-compose


## Environment Variables
| Key            | default       | description                   |
|----------------|---------------|-------------------------------|
| GOOGLE_API_KEY | ''            | for Google Maps               |
| GITHUB_TOKEN   | ''            | for Terraform GitHub provider |



## SetUp
Build docker image.

```
$ docker-compose build
```


## Run app
This project uses Webpack. In dev, run application with webpack-dev-server.

```
$ docker-compose up
```


## Deploy
Deploy with AWS CodePipeline.  
It hooks the deploy workflow to merge new commits into `production` branch.
