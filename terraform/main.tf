terraform {
  required_version = ">= 0.11.0"

  backend "s3" {
    bucket = "syakusyaku-terraform"
    region = "ap-northeast-1"
    key    = "terraform.tfstate"
  }
}

provider "aws" {
  region = "${var.region}"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}

provider "github" {
  token        = "${var.github_token}"
  organization = "${var.github_organization}"
}
