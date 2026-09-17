# Local state is fine for dev, since it only ever targets the disposable
# Floci emulator. Switch to a remote backend (see stg/prod) the moment this
# environment starts managing anything that outlives one machine.
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
