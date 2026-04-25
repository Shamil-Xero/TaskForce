pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'shamil0xero/taskforce'
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Python dependencies...'
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'python -m pytest test_app.py -v'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_HUB_REPO}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_HUB_REPO}:${BUILD_NUMBER} ${DOCKER_HUB_REPO}:latest"
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo 'Pushing image to DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_HUB_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${DOCKER_HUB_REPO}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_HUB_REPO}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                
                // Copy the read-only mounted kubeconfig and safely convert Windows paths and Localhost resolving using Python
                sh "python3 -c \"text=open('/root/.kube/config').read().replace(chr(92), '/').replace('C:', '/C:').replace('127.0.0.1', 'host.docker.internal'); open('/tmp/kubeconfig','w').write(text)\""

                sh "sed -i 's|IMAGE_TAG|${BUILD_NUMBER}|g' k8s/deployment.yaml"
                sh 'KUBECONFIG=/tmp/kubeconfig kubectl apply -f k8s/deployment.yaml --insecure-skip-tls-verify=true'
                sh 'KUBECONFIG=/tmp/kubeconfig kubectl apply -f k8s/service.yaml --insecure-skip-tls-verify=true'
                sh 'KUBECONFIG=/tmp/kubeconfig kubectl rollout status deployment/taskforce --insecure-skip-tls-verify=true'
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
