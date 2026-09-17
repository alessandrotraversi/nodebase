# Local state until a real S3 bucket + DynamoDB lock table exist for this
# account. Switch by uncommenting the block below and running:
#   terraform init -migrate-state -backend-config=backend.hcl
# with a backend.hcl (gitignored) holding this environment's bucket/table.
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }

  # backend "s3" {
  #   bucket         = "" # e.g. "nodebase-terraform-state"
  #   key            = "nestjs/stg/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "" # e.g. "nodebase-terraform-locks"
  #   encrypt        = true
  # }
}
