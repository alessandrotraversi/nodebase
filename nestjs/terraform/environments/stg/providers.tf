# Real AWS account: no endpoint override, credentials come from the
# environment's default chain (CI OIDC role, SSO profile, etc), never from
# static keys committed here.
provider "aws" {
  region = var.aws_region
}
