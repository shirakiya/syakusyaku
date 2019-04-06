variable "domain_name" {}
variable "github_token" {}

variable "github_organization" {
  default = "shirakiya"
}

variable "github_repo_name" {
  default = "syakusyaku"
}

variable "region" {}
variable "codepipeline_webhook_secret" {}
