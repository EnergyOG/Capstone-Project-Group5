![Aws Free Tier Banner](./Aws%20Free%20Tier%20Banner.png)
# AWS Free Tier Web Application Project

 

A fully deployed, secured, and monitored web application built on AWS Free Tier resources, developed by the intern cohort across four phases: environment setup, application deployment, security hardening with CDN, and CI/CD with monitoring.

 

---

 

## Table of Contents

 

- [Project Overview](#project-overview)

- [Architecture Diagram](#architecture-diagram)

- [Architecture Summary](#architecture-summary)

- [Phase 1: Project Setup & Environment Configuration](#phase-1-project-setup--environment-configuration)

- [Phase 2: Web Application Development & Deployment](#phase-2-web-application-development--deployment)

- [Phase 3: Security Hardening & CloudFront Integration](#phase-3-security-hardening--cloudfront-integration)

- [Phase 4: CI/CD Pipeline, Monitoring & Cost Management](#phase-4-cicd-pipeline-monitoring--cost-management)

- [Security Group Reference](#security-group-reference)

- [IAM Role Reference](#iam-role-reference)

- [Final Deployment Checklist](#final-deployment-checklist)

- [Repository Structure](#repository-structure)

- [Branching Strategy](#branching-strategy)

- [Project Tracking](#project-tracking)

- [Cost Management](#cost-management)

- [Troubleshooting](#troubleshooting)



---

 

## Project Overview

 

This project demonstrates a production-style web application deployment using only AWS Free Tier eligible services. The end state is a static/dynamic web application served over HTTPS through a global CDN (CloudFront), load balanced across EC2 instances, automatically deployed via GitHub Actions, and monitored with CloudWatch alarms and AWS Budgets.

 

**Goals:**

- Learn core AWS services (EC2, ALB, S3, CloudFront, ACM, IAM, CloudWatch, Budgets)

- Practice infrastructure security best practices (least privilege, origin restriction, HTTPS enforcement)

- Build a working CI/CD pipeline using GitHub Actions

- Stay within AWS Free Tier limits throughout



---

 

## Architecture Diagram

 

```

                            ┌────────────────────┐

                            │   User Browser      │

                            └──────────┬──────────┘

                                       │ HTTPS

                                       ▼

                            ┌────────────────────┐

                            │ CloudFront CDN      │

                            │ (ACM cert, HTTPS)   │──────┐

                            └──────────┬──────────┘      │

                                       │                  │ origin (OAC)

                                       ▼                  ▼

                            ┌────────────────────┐  ┌──────────────────┐

                            │ Application Load    │  │ S3 Bucket         │

                            │ Balancer (ALB)       │  │ (static assets)   │

                            │ HTTP → HTTPS redirect│  └──────────────────┘

                            └──────────┬──────────┘

                                       │

                                       ▼

                            ┌────────────────────┐

                            │ Target Group         │

                            └──────────┬──────────┘

                                       │

                     ┌─────────────────┴─────────────────┐

                     ▼                                     ▼

            ┌──────────────────┐                ┌──────────────────┐

            │ EC2 Instance 1     │                │ EC2 Instance 2     │

            │ (t2.micro)         │                │ (t2.micro, ASG)     │

            │ SG: CF prefix only │                │ SG: CF prefix only  │

            └──────────────────┘                └──────────────────┘

 

   ──────────────────────────── CI/CD ────────────────────────────

   GitHub (main/develop/feature) → GitHub Actions → SSH deploy → EC2

 

   ──────────────────────── Observability / Cost ──────────────────

   CloudWatch Alarms (CPU, 5xx) | CloudWatch Logs (7-day retention)

   AWS Budgets Alert | IAM Least-Privilege Policies

```

 

---

 

## Architecture Summary

 

| Layer | Service | Purpose |

|---|---|---|

| DNS / Edge | Route 53 (or external DNS) + CloudFront | Global content delivery, HTTPS termination |

| Certificate | AWS Certificate Manager (ACM) | Free SSL/TLS certificate for custom domain |

| Load Balancing | Application Load Balancer (ALB) | Distributes traffic, handles HTTP→HTTPS redirect |

| Compute | EC2 (t2.micro) + Auto Scaling Group | Hosts the web application |

| Storage | S3 Bucket | Stores static assets (images, CSS, JS) |

| CI/CD | GitHub + GitHub Actions | Automated deployment pipeline |

| Monitoring | CloudWatch Alarms & Logs | Operational visibility |

| Cost Control | AWS Budgets | Free Tier usage alerts |

| Access Control | IAM | Least-privilege roles and policies |

| Project Tracking | Trello | Task management (Backlog → In Progress → Review → Done) |

 

---

 

## Phase 1: Project Setup & Environment Configuration

 

**Challenge:** Set up all tools, accounts, and repositories for the project.

 

### 1.1 AWS Account & IAM Setup

 

1. Create an AWS Free Tier account.

2. Enable MFA on the root account and avoid using root credentials for daily work.

3. Create IAM users for each team member with **least-privilege permissions**:

   - `intern-admin`: full access for initial setup (restricted to project resources where possible)

   - `intern-developer`: EC2, S3, CloudWatch (read/write scoped to project resources)

4. Create IAM groups and attach policies rather than attaching policies directly to users.

5. Record account ID, region (e.g. `us-east-1`), and IAM usernames in this README under [IAM Role Reference](#iam-role-reference).



### 1.2 AWS CLI Configuration

 

Install the AWS CLI v2 locally, then configure named profiles per user/role:

 

```bash

aws configure --profile intern-admin

aws configure --profile intern-dev

```

 

Each profile should store:

- Access Key ID

- Secret Access Key

- Default region (e.g. `us-east-1`)

- Default output format (`json`)



Verify configuration:

 

```bash

aws sts get-caller-identity --profile intern-dev

```

 

### 1.3 GitHub Repository & Branching Strategy

 

1. Create a new GitHub repository (e.g. `aws-freetier-webapp`).

2. Set up branch protection rules on `main`.

3. Branching strategy:



| Branch | Purpose |

|---|---|

| `main` | Production-ready code; deploys automatically via GitHub Actions (Phase 4) |

| `develop` | Integration branch where feature branches are merged before release to `main` |

| `feature/*` | Individual feature work (e.g. `feature/navbar`, `feature/asg-config`) |

 

Workflow:

```

feature/xyz → develop (PR + review) → main (PR + review) → auto-deploy

```

 

### 1.4 Trello Board Setup

 

Create a Trello board with the following columns:

 

| Column | Purpose |

|---|---|

| Backlog | All planned tasks across phases |

| In Progress | Tasks currently being worked on |

| Review | Tasks awaiting peer review (e.g. PR review) |

| Done | Completed and verified tasks |

 

Add all team members as board members and assign cards per phase activity.

 

### 1.5 EC2 Instance Launch

 

1. Launch a `t2.micro` EC2 instance (Amazon Linux 2023 or Ubuntu 22.04).

2. Create a key pair for SSH access (store the `.pem` file securely, never commit to GitHub).

3. Configure a security group (`web-sg`) allowing:

   - Inbound HTTP (80) from `0.0.0.0/0` (temporary — restricted in Phase 3)

   - Inbound HTTPS (443) from `0.0.0.0/0` (temporary — restricted in Phase 3)

   - Inbound SSH (22) from your IP only

4. Note the instance's public IP and instance ID for later use.



### 1.6 S3 Bucket for Static Assets

 

1. Create an S3 bucket (e.g. `project-static-assets-<unique-suffix>`).

2. Initial configuration:

   - Block all public access: **enabled** initially (tightened further with OAC in Phase 3)

   - Enable versioning (optional, recommended)

3. This bucket will store images, CSS, and JS files referenced by the web application.



### 1.7 README Documentation

 

This file (`README.md`) documents:

- Environment setup steps

- AWS resource names/IDs

- Branching and PR conventions

- Architecture diagrams (see [Architecture Diagram](#architecture-diagram))



Keep this file updated at the end of each phase.

 

### 1.8 ACM Certificate Request

 

1. In AWS Certificate Manager (region: `us-east-1` — required for CloudFront), request a public certificate for your custom domain (e.g. `www.example.com`).

2. Validate via DNS (preferred) by adding the CNAME record provided by ACM to your domain's DNS settings.

3. Wait for certificate status to become **Issued** before proceeding to Phase 3.



### Phase 1 Deliverables Checklist

 

- [ ] AWS account created, MFA enabled on root

- [ ] IAM users/groups created with least-privilege policies

- [ ] AWS CLI configured with named profiles

- [ ] GitHub repo created with `main`, `develop`, branch protection

- [ ] Trello board set up with all columns and team members

- [ ] EC2 `t2.micro` instance launched, security group configured

- [ ] S3 bucket created for static assets

- [ ] README.md documents environment setup

- [ ] ACM certificate requested and validated



---

 

## Phase 2: Web Application Development & Deployment

 

**Challenge:** Build and deploy a simple web application on EC2 behind an ALB.

 

### 2.1 Web Application Development

 

1. Build a simple web application using HTML/CSS/JS (or a lightweight framework such as Flask/Express).

2. Application should serve a homepage and reference static assets (images, CSS, JS).

3. Push code to the `develop` branch, then merge to `main` via PR after review.



### 2.2 Hosting on EC2

 

1. SSH into the EC2 instance:

```bash

   ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>

```

2. Install a web server (e.g. Nginx or a runtime such as Node.js).

3. Clone the repository and configure the web server to serve the application on port 80.

4. Enable the web server to start on boot:

```bash

   sudo systemctl enable nginx

   sudo systemctl start nginx

```

 

### 2.3 Target Group Configuration

 

1. Create a Target Group:

   - Target type: Instances

   - Protocol: HTTP, Port: 80

   - Health check path: `/` (or a dedicated `/health` endpoint)

2. Register the EC2 instance(s) with the Target Group.



### 2.4 Application Load Balancer (ALB)

 

1. Create an Application Load Balancer:

   - Scheme: Internet-facing

   - Listeners: HTTP (80) and HTTPS (443)

   - Subnets: at least two Availability Zones (public subnets)

2. Attach the Target Group to the ALB.



### 2.5 ALB Listener Rules

 

1. Configure the HTTP (80) listener to **redirect to HTTPS (443)** with a 301 status code.

2. Attach the ACM certificate (from Phase 1.8) to the HTTPS (443) listener.



### 2.6 Auto Scaling Group (Optional but Encouraged)

 

1. Create a Launch Template based on the configured EC2 instance (AMI with app pre-installed, or use a user-data script to bootstrap the app on boot).

2. Create an Auto Scaling Group:

   - Min: 1, Desired: 1–2, Max: 2–3

   - Attach to the Target Group created above

   - Scaling policy: target tracking on average CPU utilization (e.g. 50%)



### 2.7 Static Assets on S3

 

1. Upload static assets (images, CSS, JS) to the S3 bucket created in Phase 1.

2. Reference these assets in the application via their public/CloudFront URL (CloudFront integration completed in Phase 3).



### 2.8 Health Check Validation

 

1. In the EC2 console, navigate to **Target Groups → Targets**.

2. Confirm instance status shows **healthy**.

3. If unhealthy, check:

   - Security group allows traffic from the ALB

   - Web server is running and listening on the configured port

   - Health check path returns HTTP 200



### 2.9 GitHub & Trello Sync

 

1. Push all application code to GitHub (`develop` → PR → `main`).

2. Update Trello cards: move completed Phase 2 tasks to **Done**, update **In Progress** as work continues.



### Phase 2 Deliverables Checklist

 

- [ ] Web application built and hosted on EC2

- [ ] Target Group created with working health checks

- [ ] ALB created and attached to Target Group

- [ ] HTTP → HTTPS redirect configured on ALB listener

- [ ] (Optional) Auto Scaling Group configured and tested

- [ ] Static assets uploaded to S3 and accessible

- [ ] Target Group shows "healthy" status

- [ ] Code pushed to GitHub; Trello board updated



---

 

## Phase 3: Security Hardening & CloudFront Integration

 

**Challenge:** Secure the deployment and add a CDN layer with CloudFront.

 

### 3.1 CloudFront Distribution

 

1. Create a CloudFront distribution:

   - Origin: the ALB DNS name (from Phase 2)

   - Origin protocol policy: HTTPS only (ALB listener must support HTTPS)

   - Viewer protocol policy: **Redirect HTTP to HTTPS**



### 3.2 Attach ACM Certificate to CloudFront

 

1. In the CloudFront distribution settings, attach the ACM certificate (must be in `us-east-1`) for your custom domain.

2. Add the custom domain as an Alternate Domain Name (CNAME) on the distribution.

3. Update your domain's DNS to point to the CloudFront distribution (e.g. ALIAS/CNAME record).



### 3.3 CloudFront Behaviors

 

1. Default behavior (`/*`):

   - Viewer protocol policy: Redirect HTTP to HTTPS

   - Cache policy: short TTL or `CachingDisabled` for dynamic content

2. Additional behavior for static assets (e.g. `/static/*` or `/assets/*`):

   - Cache policy: `CachingOptimized` with longer TTL

   - Origin: S3 bucket (via Origin Access Control, see 3.6)



### 3.4 Restrict EC2 Security Groups to CloudFront Only

 

1. Update the EC2/ALB security group (`web-sg`) to remove the `0.0.0.0/0` rules from Phase 1.

2. Add inbound rules for HTTP (80) and HTTPS (443) sourced from the **AWS-managed CloudFront prefix list**:

   - Prefix list name: `com.amazonaws.global.cloudfront.origin-facing`

3. This ensures only CloudFront can reach the ALB/EC2 directly — all other traffic is blocked.



### 3.5 IAM Least-Privilege Review

 

1. Review all IAM policies created in Phase 1 and tighten scope:

   - Restrict EC2 permissions to specific instance ARNs / tags

   - Restrict S3 permissions to the specific bucket ARN

   - Restrict CloudWatch permissions to project-specific log groups

2. Remove any wildcard (`*`) resource permissions where a specific ARN can be used instead.



### 3.6 S3 Bucket Policy with Origin Access Control (OAC)

 

1. Create an Origin Access Control (OAC) for the CloudFront distribution.

2. Update the S3 bucket policy to allow `s3:GetObject` only from the CloudFront distribution via OAC:

```json

   {

     "Version": "2012-10-17",

     "Statement": [

       {

         "Sid": "AllowCloudFrontServicePrincipal",

         "Effect": "Allow",

         "Principal": { "Service": "cloudfront.amazonaws.com" },

         "Action": "s3:GetObject",

         "Resource": "arn:aws:s3:::project-static-assets-<unique-suffix>/*",

         "Condition": {

           "StringEquals": {

             "AWS:SourceArn": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"

           }

         }

       }

     ]

   }

```

3. Ensure "Block all public access" remains enabled on the bucket — access is only via CloudFront OAC.



### 3.7 Document Open Ports & Security Group Rules

 

Document the final security posture (see [Security Group Reference](#security-group-reference)) including:

- All open ports per security group

- Source of each rule (IP range, prefix list, or security group reference)

- Justification for each rule



### 3.8 End-to-End HTTPS Flow Test

 

1. Open `https://<your-custom-domain>` in a browser.

2. Confirm:

   - Browser shows a valid HTTPS connection (padlock icon)

   - Request flows: Browser → CloudFront → ALB → EC2

   - Static assets load via the `/static/*` (or equivalent) CloudFront behavior from S3

3. Confirm direct access to the ALB DNS name or EC2 public IP over HTTP/HTTPS is **blocked** (connection refused/timeout), proving CloudFront-only access.



### Phase 3 Deliverables Checklist

 

- [ ] CloudFront distribution created with ALB as origin

- [ ] ACM certificate attached to CloudFront for custom domain

- [ ] CloudFront behaviors configured (HTTPS redirect, cache policies)

- [ ] EC2/ALB security groups restricted to CloudFront prefix list

- [ ] IAM policies reviewed and tightened to least privilege

- [ ] S3 bucket policy restricted to CloudFront OAC only

- [ ] Open ports and security group rules documented

- [ ] Full HTTPS flow tested (browser → CloudFront → ALB → EC2)



---

 

## Phase 4: CI/CD Pipeline, Monitoring & Cost Management

 

**Challenge:** Automate deployments and set up observability within Free Tier limits.

 

### 4.1 GitHub Actions CI/CD Workflow

 

Create `.github/workflows/deploy.yml`:

 

```yaml

name: Deploy to EC2

 

on:

  push:

    branches: [main]

 

jobs:

  deploy:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout code

        uses: actions/checkout@v4

 

      - name: Deploy via SSH

        uses: appleboy/ssh-action@v1.0.0

        with:

          host: ${{ secrets.EC2_HOST }}

          username: ${{ secrets.EC2_USER }}

          key: ${{ secrets.EC2_SSH_KEY }}

          script: |

            cd /var/www/app

            git pull origin main

            sudo systemctl restart nginx

```

 

Configure repository secrets under **Settings → Secrets and variables → Actions**:

 

| Secret | Description |

|---|---|

| `EC2_HOST` | Public IP or DNS of the EC2 instance |

| `EC2_USER` | SSH username (e.g. `ec2-user`) |

| `EC2_SSH_KEY` | Private key (PEM contents) for SSH authentication |

 

### 4.2 Deployment Script on EC2

 

Create `/var/www/app/deploy.sh` on the EC2 instance:

 

```bash

#!/bin/bash

set -e

cd /var/www/app

git pull origin main

# Install dependencies if needed, e.g.:

# npm install --production

sudo systemctl restart nginx

echo "Deployment complete: $(date)"

```

 

Make it executable: `chmod +x deploy.sh`. The GitHub Actions workflow can call this script directly instead of inline commands.

 

### 4.3 CloudWatch Alarms

 

Configure the following alarms (via Console or CLI):

 

| Alarm | Metric | Threshold | Action |

|---|---|---|---|

| High CPU | `CPUUtilization` (EC2) | > 80% for 5 minutes | Notify via SNS |

| High 5xx rate | `HTTPCode_ELB_5XX_Count` / `RequestCount` (ALB) | > 5% over 5 minutes | Notify via SNS |

 

Example CLI command for the CPU alarm:

 

```bash

aws cloudwatch put-metric-alarm \

  --alarm-name "high-cpu-utilization" \

  --metric-name CPUUtilization \

  --namespace AWS/EC2 \

  --statistic Average \

  --period 300 \

  --threshold 80 \

  --comparison-operator GreaterThanThreshold \

  --dimensions Name=InstanceId,Value=<INSTANCE_ID> \

  --evaluation-periods 1 \

  --alarm-actions <SNS_TOPIC_ARN> \

  --profile intern-dev

```

 

### 4.4 CloudWatch Logs

 

1. Install and configure the CloudWatch Agent on EC2 to forward application/web server logs.

2. Create a log group (e.g. `/aws/ec2/webapp`) with **retention set to 7 days**:



```bash

aws logs put-retention-policy \

  --log-group-name "/aws/ec2/webapp" \

  --retention-in-days 7 \

  --profile intern-dev

```

 

### 4.5 AWS Budgets Alert

 

1. Create a budget in AWS Budgets:

   - Budget type: Cost budget

   - Amount: set close to Free Tier limits (e.g. $1–5 buffer)

   - Alert threshold: e.g. 80% and 100% of budgeted amount

   - Notification: email to all team members

2. This ensures the team is notified before incurring unexpected charges.



### 4.6 Trello Board Finalization

 

1. Move all completed tasks across all phases to **Done**.

2. Close out or archive remaining backlog items with notes on status.

3. Ensure the board reflects the true final state of the project for retrospective purposes.



### 4.7 Final Deployment Checklist & README Update

 

1. Complete the [Final Deployment Checklist](#final-deployment-checklist) below.

2. Add the [Architecture Diagram](#architecture-diagram) (already included above) to this README.

3. Ensure all environment variables, secrets, and configuration steps are documented (without exposing actual secret values).



### 4.8 Peer Code Review

 

1. Before merging any feature into `develop` or `develop` into `main`, open a Pull Request on GitHub.

2. At least one other team member must review and approve the PR.

3. Use PR templates/checklists to confirm:

   - Code builds/runs locally

   - No secrets committed

   - Documentation updated if needed



### Phase 4 Deliverables Checklist

 

- [ ] GitHub Actions workflow deploys to EC2 on push to `main`

- [ ] Deployment script tested and working via SSH

- [ ] CloudWatch alarms configured for CPU > 80% and ALB 5xx > 5%

- [ ] CloudWatch Logs enabled with 7-day retention

- [ ] AWS Budgets alert configured and tested

- [ ] Trello board fully updated, backlog closed out

- [ ] Final deployment checklist completed

- [ ] README updated with architecture diagram

- [ ] All changes peer-reviewed via GitHub PRs before final merge



---

 

## Security Group Reference

 

| Security Group | Inbound Rule | Port | Source | Notes |

|---|---|---|---|---|

| `alb-sg` | HTTP | 80 | `0.0.0.0/0` | Redirects to HTTPS via listener rule |

| `alb-sg` | HTTPS | 443 | `0.0.0.0/0` | Terminates TLS with ACM cert |

| `web-sg` (EC2) | HTTP | 80 | `com.amazonaws.global.cloudfront.origin-facing` | CloudFront-only after Phase 3 |

| `web-sg` (EC2) | HTTPS | 443 | `com.amazonaws.global.cloudfront.origin-facing` | CloudFront-only after Phase 3 |

| `web-sg` (EC2) | SSH | 22 | Admin IP / GitHub Actions runner | Used for CI/CD deployment |

 

> **Note:** Prior to Phase 3, `web-sg` may temporarily allow `0.0.0.0/0` on 80/443 for initial testing. This must be tightened before Phase 3 sign-off.

 

---

 

## IAM Role Reference

 

| Role / User | Permissions | Scope |

|---|---|---|

| `intern-admin` | Administrative access for initial setup | Project resources (tagged) |

| `intern-developer` | EC2 describe/start/stop, S3 read/write, CloudWatch read/write | Specific instance ARNs, specific bucket ARN |

| `ci-cd-deploy-role` | SSH access to EC2 via stored key (no AWS API access required if using SSH-based deploy) | EC2 instance only |

| CloudFront OAC (service-linked) | `s3:GetObject` on static assets bucket | Specific bucket ARN, scoped to distribution ARN |

 

---

 

## Final Deployment Checklist

 

- [ ] Custom domain resolves to CloudFront distribution

- [ ] HTTPS enforced end-to-end (browser → CloudFront → ALB → EC2)

- [ ] HTTP requests redirect to HTTPS at both CloudFront and ALB layers

- [ ] EC2/ALB security groups accept traffic only from CloudFront prefix list

- [ ] S3 bucket is private; accessible only via CloudFront OAC

- [ ] Auto Scaling Group (if used) maintains healthy instance count

- [ ] CloudWatch alarms active for CPU and ALB 5xx errors

- [ ] CloudWatch Logs retained for 7 days

- [ ] AWS Budgets alert configured and verified

- [ ] GitHub Actions successfully deploys on push to `main`

- [ ] All PRs reviewed and approved before merge

- [ ] Trello board reflects final project status

- [ ] README.md fully updated with architecture and setup documentation



---

 

## Repository Structure

 

```

aws-freetier-webapp/

├── .github/

│   └── workflows/

│       └── deploy.yml

├── src/

│   ├── index.html

│   ├── css/

│   │   └── styles.css

│   └── js/

│       └── app.js

├── scripts/

│   └── deploy.sh

├── docs/

│   └── architecture-diagram.png

└── README.md

```

 

---

 

## Branching Strategy

 

- **`main`** — production branch; protected; triggers automatic deployment to EC2 via GitHub Actions

- **`develop`** — integration branch for completed features before release

- **`feature/<name>`** — individual feature branches (e.g. `feature/responsive-navbar`, `feature/asg-config`)



**Workflow:**

1. Create a feature branch from `develop`

2. Open a PR into `develop`; require at least one peer review

3. Once `develop` is stable, open a PR into `main`

4. Merging into `main` triggers the deployment pipeline



---

 

## Project Tracking

 

Trello board columns and usage:

 

| Column | Usage |

|---|---|

| **Backlog** | All tasks from Phases 1–4, broken into individual cards |

| **In Progress** | Tasks actively being worked on (limit WIP per person) |

| **Review** | Tasks with an open PR awaiting peer review |

| **Done** | Merged, deployed, and verified tasks |

 

All team members are added as board members with cards assigned per activity.

 

---

 

## Cost Management

 

- All resources are selected to remain within AWS Free Tier limits (EC2 `t2.micro`, S3 standard storage under 5GB, CloudFront under 1TB data transfer/month, etc.)

- AWS Budgets is configured to alert the team via email at 80% and 100% of the defined threshold.

- Regularly review the AWS Billing Dashboard and Cost Explorer to track usage trends.

- Decommission unused resources (e.g. extra EC2 instances from ASG testing) promptly to avoid charges.



---

 

## Troubleshooting

 

| Issue | Possible Cause | Resolution |

|---|---|---|

| Target group shows "unhealthy" | Web server not running, wrong port, or security group blocking ALB | Check service status, verify SG allows ALB traffic on health check port |

| CloudFront returns 403 on static assets | S3 bucket policy/OAC misconfigured | Verify OAC is attached and bucket policy references correct distribution ARN |

| HTTPS not working on custom domain | ACM certificate not validated or not attached | Confirm certificate status is "Issued" and attached to CloudFront/ALB listener |

| GitHub Actions deploy fails | Incorrect secrets or SSH connectivity issue | Verify `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` secrets; check EC2 security group allows SSH from runner |

| Direct EC2/ALB access still works over HTTP | Security group not restricted to CloudFront prefix list | Update `web-sg` inbound rules to use `com.amazonaws.global.cloudfront.origin-facing` |

| AWS Budgets alert not received | Notification email not confirmed or threshold misconfigured | Re-check SNS subscription confirmation and budget threshold settings |

 

---

 

## Team

 

| Name | Role | GitHub Handle |

|---|---|---|

| _Add team member_ | _Role_ | _@handle_ |

| _Add team member_ | _Role_ | _@handle_ |

 

---

 

*Last updated: Phase 4 — Project completion*
