module "secrets" {
  source = "../../modules/secrets-manager"

  # Floci has no real deletion-window semantics, and dev secrets are
  # disposable anyway — skip the wait so `terraform destroy` is instant.
  recovery_window_in_days = 0

  secrets = {
    "app/database" = {
      username = "app"
      password = "local-dev-password"
    }
  }

  tags = {
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}
