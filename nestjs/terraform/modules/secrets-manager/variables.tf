variable "secrets" {
  description = <<-EOT
    Map of secret id (e.g. "app/database") to its value, given as a map of
    key/value pairs. Each entry becomes one aws_secretsmanager_secret, stored
    as a JSON-encoded string — the shape the app's SecretsService expects.
  EOT
  type        = map(map(string))
}

variable "recovery_window_in_days" {
  description = <<-EOT
    Days AWS waits before permanently deleting a secret after it's destroyed.
    Real AWS requires 7-30 (or 0 to skip the window entirely). Local emulators
    such as Floci don't enforce a minimum, so dev/stg typically pass 0.
  EOT
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags applied to every secret this module creates."
  type        = map(string)
  default     = {}
}
