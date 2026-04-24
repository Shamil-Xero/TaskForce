# Todo App — CI/CD with Jenkins, Docker & Kubernetes

A simple REST API built with Flask, deployed using a full CI/CD pipeline.

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
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Local testing
├── Jenkinsfile             # CI/CD pipeline
└── k8s/
    ├── deployment.yaml     # Kubernetes Deployment
    └── service.yaml        # Kubernetes Service (NodePort)
```

## API Endpoints

| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| GET    | /tasks           | Get all tasks    |
| POST   | /tasks           | Create a task    |
| GET    | /tasks/<id>      | Get one task     |
| PUT    | /tasks/<id>      | Update a task    |
| DELETE | /tasks/<id>      | Delete a task    |
| GET    | /health          | Health check     |

## Prerequisites

- Python 3.11+
- Docker Desktop
- Minikube
- Jenkins (running as Docker container)
- GitHub account
- DockerHub account

## Setup Steps

### 1. Run Locally
```bash
pip install -r requirements.txt
python app.py
```

### 2. Run Tests
```bash
pytest test_app.py -v
```

### 3. Run with Docker
```bash
docker build -t todo-app .
docker run -p 5000:5000 todo-app
```

### 4. Start Minikube
```bash
minikube start
```

### 5. Deploy to Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
minikube service todo-app-service --url
```

### 6. Jenkins Pipeline
- Run Jenkins: `docker run -p 8080:8080 jenkins/jenkins:lts`
- Add DockerHub credentials (ID: `dockerhub-credentials`)
- Create Pipeline job pointing to this repo
- Add GitHub webhook → `http://<jenkins-url>/github-webhook/`
- Push to GitHub to trigger the pipeline

## Sample API Calls

```bash
# Create a task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Kubernetes"}'

# Get all tasks
curl http://localhost:5000/tasks

# Update a task
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'

# Delete a task
curl -X DELETE http://localhost:5000/tasks/1
```
