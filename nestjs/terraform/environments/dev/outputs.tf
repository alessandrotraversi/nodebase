output "secret_arns" {
  description = "Map of secret id to its ARN."
  value       = module.secrets.secret_arns
}

output "secret_ids" {
  description = "Map of secret id to itself."
  value       = module.secrets.secret_ids
}
