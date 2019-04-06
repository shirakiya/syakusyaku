resource "aws_acm_certificate" "cert" {
  provider          = "aws.us_east_1"
  domain_name       = "syakusyaku.shirakiya.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name    = "syakusyaku"
    Project = "syakusyaku"
  }
}

# This hosted zone is already created
data "aws_route53_zone" "zone" {
  name         = "${var.domain_name}"
  private_zone = false
}

# Register the record for validation
resource "aws_route53_record" "cert_validation" {
  zone_id = "${data.aws_route53_zone.zone.id}"
  name    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_name}"
  type    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_type}"
  records = ["${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}"]
  ttl     = 300
}

# validate cert
resource "aws_acm_certificate_validation" "cert" {
  provider                = "aws.us_east_1"
  certificate_arn         = "${aws_acm_certificate.cert.arn}"
  validation_record_fqdns = ["${aws_route53_record.cert_validation.fqdn}"]
}

resource "aws_route53_record" "cloudfront" {
  zone_id = "${data.aws_route53_zone.zone.id}"
  name    = "syakusyaku.${var.domain_name}."
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.syakusyaku.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.syakusyaku.hosted_zone_id}"
    evaluate_target_health = false
  }
}
