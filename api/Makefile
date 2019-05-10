.PHONY: deps clean build start-api package deploy

deps:
	go get -u ./...

clean:
	rm -f ./dist/*

build: clean
	GOOS=linux GOARCH=amd64 go build -o dist/handler ./handlers

start-api: build
	sam local start-api

package: build
	sam package --template-file template.yaml --output-template-file output-template.yaml --s3-bucket syakusyaku-infra

deploy:
	sam deploy --template-file output-template.yaml --stack-name syakusyaku-api --capabilities CAPABILITY_IAM
