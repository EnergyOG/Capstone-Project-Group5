![Aws Free Tier Banner](./Aws%20Free%20Tier%20Banner.png)
# AWS Free Tier Project – Intern Cohort

## Overview
This project is a multi-phase cloud deployment exercise designed to take a web application from setup to production-like deployment using AWS Free Tier services. It covers infrastructure setup, deployment, security, CI/CD, monitoring, and final presentation.

---

# Phase 1: Project Setup & Environment Configuration

This phase covers the initial setup of the AWS environment, development workflow, and project collaboration tools.

## AWS Account & IAM Configuration

- Created an AWS Free Tier account.
- Configured IAM users with least-privilege access control for security best practices.
- Ensured separate permissions for admin and developer roles.

## AWS CLI Setup

- Download the AWS CLI package.
```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
```

- Install the AWS CLI package
```bash
sudo installer -pkg AWSCLIV2.pkg -target /
```

- Confirm installation
```bash
aws --version
```

- Configured named profiles for multiple environments using:
```bash
aws configure --profile dev
```

- Verified the setup using AWS CLI commands.

## GitHub Repository Setup

- Created a GitHub repository for version control.
- Implemented the following branching strategy:
  - **main** → Production-ready code
  - **develop** → Integration branch
  - **feature/\*** → Individual feature development

## Project Management (Trello)

- Created a Trello board to manage project tasks.
- Defined workflow columns:
  - Backlog
  - In Progress
  - Review
  - Done
- Added all team members to the board for collaboration.

## AWS EC2 Setup

- Launched an EC2 instance (**t2.micro**) under the AWS Free Tier.
- Configured security groups to allow:
  - HTTP (**Port 80**)
  - HTTPS (**Port 443**)
- Restricted unnecessary inbound traffic for improved security.

## AWS S3 Setup

- Created an S3 bucket for static assets.
- Configured appropriate public access settings where required for asset hosting.
- Enabled secure storage for images and frontend assets.

## SSL/TLS Configuration

- Requested a free SSL/TLS certificate using AWS Certificate Manager (ACM).
- Prepared the certificate for securing HTTPS traffic on deployed services.

---

