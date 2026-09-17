# Generates the credential instead of accepting it as an input — nobody
# has to type, share, or commit a staging DB password this way.
resource "random_password" "database" {
  length  = 32
  special = true
}

module "secrets" {
  source = "../../modules/secrets-manager"

  # A week is enough to notice and undo an accidental delete without
  # blocking a deliberate one for long.
  recovery_window_in_days = 7

  secrets = {
    "app/database" = {
      username = "app"
      password = random_password.database.result
    }
  }

  tags = {
    Environment = "stg"
    ManagedBy   = "terraform"
  }
}
