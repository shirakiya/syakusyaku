data "aws_kms_alias" "syakusyaku_key" {
  name = "alias/syakusyaku_key"
}

resource "aws_iam_role" "codepipeline_service_role" {
  name = "syakusyaku-codepipeline-service-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "codepipeline_service_role" {
  name = "SyakusyakuCodepipelinePolicy"
  role = "${aws_iam_role.codepipeline_service_role.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "${aws_s3_bucket.infra.arn}",
        "${aws_s3_bucket.infra.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role" "codebuild_service_role" {
  name = "syakusyaku-codebuild-service-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "codedeploy_service_role" {
  name = "SyakusyakuCodebuildPolicy"
  role = "${aws_iam_role.codebuild_service_role.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "${aws_s3_bucket.public.arn}",
        "${aws_s3_bucket.public.arn}/*",
        "${aws_s3_bucket.infra.arn}",
        "${aws_s3_bucket.infra.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters"
      ],
      "Resource": [
        "arn:aws:ssm:${var.region}:${data.aws_caller_identity.self.account_id}:parameter/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": [
        "${data.aws_kms_alias.syakusyaku_key.arn}"
      ]
    }
  ]
}
EOF
}
