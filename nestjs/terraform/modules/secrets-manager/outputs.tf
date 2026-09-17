output "secret_arns" {
  description = "Map of secret id to its ARN."
  value       = { for id, secret in aws_secretsmanager_secret.this : id => secret.arn }
}

output "secret_ids" {
  description = "Map of secret id to itself — the value the app's SECRETS_MANAGER_SECRET_ID env var expects."
  value       = { for id, secret in aws_secretsmanager_secret.this : id => secret.name }
}
