resource "aws_cloudfront_origin_access_identity" "syakusyaku" {
  comment = "access-identity-${aws_s3_bucket.public.bucket_domain_name}"
}

resource "aws_cloudfront_distribution" "syakusyaku" {
  enabled             = true
  aliases             = ["syakusyaku.${var.domain_name}"]
  price_class         = "PriceClass_200"
  default_root_object = "index.html"

  origin {
    domain_name = "${aws_s3_bucket.public.bucket_domain_name}"
    origin_id   = "S3-${aws_s3_bucket.public.id}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.syakusyaku.cloudfront_access_identity_path}"
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3-${aws_s3_bucket.public.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    min_ttl                = 0
    max_ttl                = 31536000
    default_ttl            = 86400
    compress               = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  logging_config {
    bucket = "${aws_s3_bucket.infra.bucket_domain_name}"
    prefix = "cloudfront"
  }

  viewer_certificate {
    acm_certificate_arn      = "${aws_acm_certificate.cert.arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }

  tags {
    Project = "syakusyaku"
  }
}
