variable "aws_region" {
  description = "AWS region secrets are created in."
  type        = string
  default     = "us-east-1"
}

variable "aws_access_key" {
  description = "Static AWS access key. Only used when aws_endpoint_url is set (local emulator); ignored otherwise."
  type        = string
  default     = "test"
}

variable "aws_secret_key" {
  description = "Static AWS secret key. Only used when aws_endpoint_url is set (local emulator); ignored otherwise."
  type        = string
  default     = "test"
}

variable "aws_endpoint_url" {
  description = <<-EOT
    AWS API endpoint override, e.g. "http://localhost:4566" to target a local
    Floci emulator (https://floci.io). Leave empty ("") to talk to real AWS
    using the environment's default credential chain instead.
  EOT
  type        = string
  default     = ""
}
