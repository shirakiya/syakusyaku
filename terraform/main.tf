locals {
  project_id     = "syakusyaku"
  project_number = "125838661316"
  region         = "asia-northeast1"
}

provider "google" {
  project = local.project_id
  region  = local.region
}

terraform {
  # See README.md
  backend "gcs" {
    bucket  = "syakusyaku-terraform-backend"
    prefix  = ""
    version = ">= v3.55"
  }
}

# And, enable cloudresourcemanager.googleapis.com to use terraform gcp provider.
