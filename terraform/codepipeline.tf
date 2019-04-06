# TODO: Terraform can't handle build log settings. So, set by hand if you need.
resource "aws_codebuild_project" "main" {
  name         = "syakusyaku-deploy"
  description  = "Build and Deploy in syakusyaku project."
  service_role = "${aws_iam_role.codebuild_service_role.arn}"

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    type            = "LINUX_CONTAINER"
    image           = "aws/codebuild/nodejs:10.14.1"
    privileged_mode = false

    environment_variable {
      "name"  = "GOOGLE_API_KEY"
      "value" = "syakusyaku.GOOGLE_API_KEY"
      "type"  = "PARAMETER_STORE"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }

  artifacts {
    type = "CODEPIPELINE"
  }

  tags = {
    Project = "syakusyaku"
  }
}

resource "aws_codepipeline" "main" {
  name     = "syakusyaku-deploy"
  role_arn = "${aws_iam_role.codepipeline_service_role.arn}"

  artifact_store {
    location = "${aws_s3_bucket.infra.bucket}"
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        Owner  = "shirakiya"
        Repo   = "syakusyaku"
        Branch = "production"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "BuildAndDeploy"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["SourceArtifact"]
      version          = "1"
      output_artifacts = ["BuildArtifact"]

      configuration = {
        ProjectName = "${aws_codebuild_project.main.name}"
      }
    }
  }
}

resource "aws_codepipeline_webhook" "main" {
  name            = "syakusyaku-codepipeline-webhook"
  authentication  = "GITHUB_HMAC"
  target_action   = "Source"
  target_pipeline = "${aws_codepipeline.main.name}"

  authentication_configuration {
    secret_token = "${var.codepipeline_webhook_secret}"
  }

  filter {
    json_path    = "$.ref"
    match_equals = "refs/heads/production"
  }
}

resource "github_repository_webhook" "main" {
  repository = "${var.github_repo_name}"

  name = "web"

  configuration {
    url          = "${aws_codepipeline_webhook.main.url}"
    content_type = "application/json"
    insecure_ssl = true
    secret       = "${var.codepipeline_webhook_secret}"
  }

  events = ["push"]
}
