# Todo App — CI/CD with Jenkins, Docker & Kubernetes

A simple REST API built with Flask, deployed using a full CI/CD pipeline. 
This project has been implemented to successfully achieve the **End-to-End CI/CD Pipeline Implementation using Jenkins, Docker, and Kubernetes for Scalable Application Deployment** DevOps assignment!

## Architecture

```
GitHub Push → Jenkins Pipeline → Run Tests → Build Docker Image
→ Push to DockerHub → Deploy to Kubernetes (Minikube)
```

## Project Structure

```
todo-app/
├── app.py                  # Flask REST API
├── test_app.py             # Unit tests
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker image definition for Application
├── docker-compose.yml      # Local testing
├── Jenkinsfile             # CI/CD pipeline instructions
├── Dockerfile.jenkins      # Custom Jenkins image with Docker & Kubectl CLI
├── docker-compose-jenkins.yml # Jenkins server orchestrator
└── k8s/
    ├── deployment.yaml     # Kubernetes Deployment
    └── service.yaml        # Kubernetes Service (NodePort)
```

## Prerequisites

- Python 3.11+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed & **Running** on your machine
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- GitHub account
- DockerHub account

## Step-by-Step Setup Guide

### 1. Start Your Environment
Ensure **Docker Desktop** is open and running on your Windows device. Then, start Minikube.
```bash
minikube start
```

### 2. Run the Custom Jenkins Server
To flawlessly run our CI/CD pipeline, Jenkins needs tools like Docker CLI, Kubectl, and Python. We created a custom Dockerfile & Compose setup out-of-the-box for you.
```bash
docker-compose -f docker-compose-jenkins.yml up -d --build
```
> Wait a few seconds for the image to build and start. Jenkins will run at `http://localhost:8080`.
> Retrieve your initial admin password by running:
> ```bash
> docker exec jenkins_custom cat /var/jenkins_home/secrets/initialAdminPassword
> ```
> Follow the UI setup, install suggested plugins, and log in.

### 3. Setup Jenkins Pipeline Credentials
1. Under **Manage Jenkins > Credentials > System > Global credentials (unrestricted)**:
2. Add a new **Username with password** credential.
3. ID: `dockerhub-credentials`
4. Username: `<your-dockerhub-username>`
5. Password: `<your-dockerhub-password/token>`

### 4. Create the Pipeline
1. Go to your Jenkins Dashboard -> **New Item** -> **Pipeline** -> Name it `TaskForce`.
2. Scroll to Pipeline definition, select **Pipeline script from SCM**.
3. Choose **Git** -> Repository URL: `https://github.com/Shamil-Xero/TaskForce.git`
4. Branch Specifier: `*/main`
5. Click **Save** and hit **Build Now** to verify the end-to-end integration!

### 5. Verify the Kubernetes Deployment
Once Jenkins finishes building and pushing the updated tag to your cluster, verify it using:
```bash
kubectl get pods
minikube service taskforce-service --url
```

## Sample API Calls

```bash
# Get all tasks
curl http://localhost:5000/tasks

# Create a task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Kubernetes"}'
```
