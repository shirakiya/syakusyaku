resource "aws_s3_bucket" "infra" {
  bucket = "syakusyaku-infra"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags {
    Project = "syakusyaku"
  }
}

resource "aws_s3_bucket" "public" {
  bucket = "syakusyaku-public"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags {
    Project = "syakusyaku"
  }
}
