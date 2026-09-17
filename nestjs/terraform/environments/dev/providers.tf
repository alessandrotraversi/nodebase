provider "aws" {
  region = var.aws_region

  # Real AWS: leave access_key/secret_key unset so the provider falls back
  # to its default credential chain (env vars, SSO, an IAM role, etc).
  access_key = var.aws_endpoint_url != "" ? var.aws_access_key : null
  secret_key = var.aws_endpoint_url != "" ? var.aws_secret_key : null

  # These checks assume a real AWS account exists to validate against —
  # local emulators like Floci have none, so skip them when targeting one.
  skip_credentials_validation = var.aws_endpoint_url != ""
  skip_metadata_api_check     = var.aws_endpoint_url != ""
  skip_requesting_account_id  = var.aws_endpoint_url != ""

  dynamic "endpoints" {
    for_each = var.aws_endpoint_url != "" ? [var.aws_endpoint_url] : []
    content {
      secretsmanager = endpoints.value
    }
  }
}
