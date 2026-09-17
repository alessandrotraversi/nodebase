# Terraform

Infrastructure as code for this app's AWS resources (currently: Secrets
Manager). Provisioning used to be a shell script run by Floci's init hooks
(`docker/floci/init/ready.d`, in an earlier revision of this repo) — this
replaces that with plan-then-apply Terraform, for local dev and real AWS
alike.

## Layout

```
terraform/
├── modules/              # Reusable, environment-agnostic building blocks
│   └── secrets-manager/  # Creates N Secrets Manager secrets from a map
└── environments/         # One fully self-contained root module per environment
    ├── dev/               # → Floci (local AWS emulator, no real account)
    ├── stg/               # → real AWS
    └── prod/              # → real AWS
```

Each environment under `environments/` is a separate Terraform root with its
own state, provider config, and `.tfvars` — nothing is shared implicitly
between dev/stg/prod, so a mistake in one can't touch another. They all
consume the same `modules/secrets-manager` module, so the actual resources
they create stay consistent; only the inputs differ per environment.

This structure scales the way you'd expect as the app grows:
- A new AWS resource (an S3 bucket, an RDS instance, an SQS queue) becomes a
  new module under `modules/`.
- Each environment's `main.tf` opts into it by adding a `module` block —
  dev might adopt something before stg/prod do, or with different inputs.
- A new environment (e.g. `sandbox`) is a new folder under `environments/`
  copying an existing one's structure.

## Environments

| Environment | Target                          | Backend                          | Secret value          |
|-------------|----------------------------------|-----------------------------------|------------------------|
| `dev`       | Floci at `http://localhost:4566` | local (`terraform.tfstate`)       | hardcoded, disposable  |
| `stg`       | real AWS                         | local for now, S3+lock table ready to enable | `random_password` — never typed or committed |
| `prod`      | real AWS                         | local for now, S3+lock table ready to enable | `random_password` — never typed or committed |

## Usage

### dev (against Floci)

Run from the project root (`nestjs/`):

```sh
# 1. Start the emulator
npm run docker:up -- -d floci   # or: docker compose -f docker/docker-compose.yml up -d floci

# 2. Provision the secret(s) into it
npm run tf:dev:init
npm run tf:dev:apply
# (equivalent to: cd terraform/environments/dev && terraform init && terraform apply)
```

`dev/terraform.tfvars` already points `aws_endpoint_url` at
`http://localhost:4566` with the dummy `test`/`test` credentials Floci
expects — nothing else to configure. Run `docker compose down -v` and
you'll need to `terraform apply` again, since Floci's state (and whatever
Terraform put into it) is gone with the container's volume.

### stg / prod (against real AWS)

```sh
cd terraform/environments/stg   # or prod
terraform init
terraform plan   # review before ever applying to a real account
terraform apply
```

These use the AWS provider's default credential chain — set up
`AWS_PROFILE`, an SSO login, or (in CI) an OIDC role first; there are no
static keys to configure here or anywhere in this repo.

Before the first real `apply`, switch the backend from local to remote:
create a `backend.hcl` (gitignored — it's environment-specific, not secret)
with that environment's S3 bucket/DynamoDB table, uncomment the `backend
"s3" {}` block in `backend.tf`, then:

```sh
terraform init -migrate-state -backend-config=backend.hcl
```

## What the app reads

The `SecretsService` (`../src/secrets/secrets.service.ts`) reads a secret by
id via `SECRETS_MANAGER_SECRET_ID` (default `app/database`) — exactly the id
this module creates. Point the running app at whichever environment's
Secrets Manager it should read from via `AWS_ENDPOINT_URL` / `AWS_REGION`
(see `../.env.example`).
