# Generates the credential instead of accepting it as an input — nobody
# has to type, share, or commit a production DB password this way.
resource "random_password" "database" {
  length  = 32
  special = true
}

module "secrets" {
  source = "../../modules/secrets-manager"

  # The full 30-day AWS default: give enough time to catch and reverse an
  # accidental delete against production.
  recovery_window_in_days = 30

  secrets = {
    "app/database" = {
      username = "app"
      password = random_password.database.result
    }
  }

  tags = {
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}
