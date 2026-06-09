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

# Phase 2: Web Application Development & Deployment

## Challenge
Build and deploy a simple web application on EC2 behind an Application Load Balancer (ALB).

## Activities
- Develop a simple web application (HTML/CSS/JS or lightweight framework)
- Host the application on EC2
- Configure a Target Group pointing to EC2 instance(s)
- Create an Application Load Balancer (ALB)
- Configure ALB listener rules (HTTP → HTTPS redirect)
- Set up Auto Scaling Group (optional but encouraged)
- Upload static assets (images, CSS, JS) to S3
- Serve static assets via public S3 URLs
- Test ALB health checks and ensure instances are healthy
- Push all code to GitHub
- Track progress on Trello board

---

# Phase 3: Security Hardening & CloudFront Integration

## Challenge
Secure the deployment and add a CDN layer using CloudFront.

## Activities
- Create a CloudFront distribution with ALB as origin
- Attach ACM certificate to CloudFront for HTTPS enforcement
- Configure CloudFront behaviors:
  - Redirect HTTP → HTTPS
  - Set cache policies for static assets
- Restrict EC2 security groups to only allow traffic from CloudFront
- Apply IAM policies using least privilege principle
- Configure S3 bucket policies to allow only CloudFront OAC access
- Review and document all open ports and security group rules
- Test full HTTPS flow:
  - Browser → CloudFront → ALB → EC2

---

# Phase 4: CI/CD Pipeline, Monitoring & Cost Management

## Challenge
Automate deployments and set up observability within Free Tier limits.

## Activities
- Create GitHub Actions workflow for automatic deployment to EC2
- Deploy using SSH pull-based deployment script
- Configure CloudWatch alarms:
  - EC2 CPU utilization > 80%
  - ALB 5xx error rate > 5%
- Enable CloudWatch logs with 7-day retention
- Set up AWS Budgets alerts for cost tracking
- Update Trello board and close completed tasks
- Write final deployment checklist
- Add architecture diagram to README
- Conduct peer code review via GitHub Pull Requests

---

# Phase 5: Intern Presentation – Project Showcase

## Challenge
Present the completed cloud project and demonstrate the live system.

## What to Present
- Problem statement and solution overview
- Architecture walkthrough (CloudFront → ALB → EC2)
- Security implementation details
- Live CI/CD pipeline demo (GitHub Actions)
- Trello board progress review
- Live application demo via CloudFront URL (HTTPS)
- Challenges faced and resolutions
- Lessons learned and improvements

## Deliverables
- GitHub repository with full source code
- Completed Trello board screenshots
- Architecture diagram
- Live HTTPS CloudFront URL
- Updated README with setup guide
- Presentation slides
- Optional recorded demo video

---

# Expected Outcome Interface Example

## Secure Web App – Deployed on AWS

https://d1abc123.cloudfront.net (HTTPS · CloudFront CDN)

**MyCloudApp Navigation:**
- Home
- About
- Dashboard
- Contact

## Features
- Secure HTTPS web application
- CloudFront CDN distribution
- Application Load Balancer routing
- EC2 backend hosting
- SSL via ACM
- Auto-scaled architecture (optional)
- CI/CD via GitHub Actions

---

# Links to Resources and Documentation

- AWS CloudFront  
  https://docs.aws.amazon.com/cloudfront  

- Application Load Balancer  
  https://docs.aws.amazon.com/elasticloadbalancing  

- Amazon EC2  
  https://docs.aws.amazon.com/ec2  

- AWS Certificate Manager  
  https://docs.aws.amazon.com/acm  

- AWS IAM  
  https://docs.aws.amazon.com/iam  

- Amazon S3  
  https://docs.aws.amazon.com/s3  

- GitHub Actions  
  https://docs.github.com/en/actions  

- Trello Guide  
  https://trello.com/guide  

- AWS Budgets  
  https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html  

- AWS Free Tier  
  https://aws.amazon.com/free