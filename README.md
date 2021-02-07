<p align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/shirakiya/syakusyaku/master/src/assets/logo.png">
</p>

[![CircleCI](https://circleci.com/gh/shirakiya/syakusyaku.svg?style=svg)](https://circleci.com/gh/shirakiya/syakusyaku)

# syakusyaku (尺々)
You can see the distance on Google Maps with Syakusyaku.  
https://syakusyaku.shirakiya.com/


## Requirements
- Node.js >= 12
- Docker / docker-compose


## Environment Variables
| Key            | default       | description                                                 |
|----------------|---------------|-------------------------------------------------------------|
| GOOGLE_API_KEY | ''            | for Google Maps                                             |



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
```


## Deploy
Deploy from CircleCI to Firebase Hosting.  
It hooks the workflow to push git tags named 'v...'.

