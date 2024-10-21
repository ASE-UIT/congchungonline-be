pipeline {
    agent any

    tools {nodejs "nodejs"}

    environment {
        NODE_ENV = 'development'
        PORT = 3100
        HOST = "${env.GITHUB_ENV.HOST}"
        MONGODB_URL = "${env.GITHUB_ENV.MONGODB_URL}"
        JWT_SECRET = "${env.GITHUB_ENV.JWT_SECRET}"
        JWT_ACCESS_EXPIRATION_MINUTES = 30
        JWT_REFRESH_EXPIRATION_DAYS = 30
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES = 10
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = 10
        SMTP_HOST = "${env.GITHUB_ENV.SMTP_HOST}"
        SMTP_PORT = 587
        SMTP_USERNAME = "${env.GITHUB_ENV.SMTP_USERNAME}"
        SMTP_PASSWORD = "${env.GITHUB_ENV.SMTP_PASSWORD}"
        EMAIL_FROM = "${env.GITHUB_ENV.EMAIL_FROM}"
        GOOGLE_CLIENT_ID = "${env.GITHUB_ENV.GOOGLE_CLIENT_ID}"
        GOOGLE_CLIENT_SECRET = "${env.GITHUB_ENV.GOOGLE_CLIENT_SECRET}"
        GOOGLE_CALLBACK_URL = "${env.GITHUB_ENV.GOOGLE_CALLBACK_URL}"
        GEMINI_API_KEY = "${env.GITHUB_ENV.GEMINI_API_KEY}"
        FIREBASE_TYPE = "${env.GITHUB_ENV.FIREBASE_TYPE}"
        FIREBASE_PROJECT_ID = "${env.GITHUB_ENV.FIREBASE_PROJECT_ID}"
        FIREBASE_STORAGE_BUCKET = "${env.GITHUB_ENV.FIREBASE_STORAGE_BUCKET}"
        FIREBASE_PRIVATE_KEY_ID = "${env.GITHUB_ENV.FIREBASE_PRIVATE_KEY_ID}"
        FIREBASE_PRIVATE_KEY = "${env.GITHUB_ENV.FIREBASE_PRI}"
        FIREBASE_CLIENT_EMAIL = "${env.GITHUB_ENV.FIREBASE_CLIENT_EMAIL}"
        FIREBASE_CLIENT_ID = "${env.GITHUB_ENV.FIREBASE_CLIENT_ID}"
        FIREBASE_AUTH_URI = "${env.GITHUB_ENV.FIREBASE_AUTH_URI}"
        FIREBASE_TOKEN_URI = "${env.GITHUB_ENV.FIREBASE_TOKEN_URI}"
        FIREBASE_AUTH_PROVIDER_X509_CERT_URL = "${env.GITHUB_ENV.FIREBASE_AUTH_PROVIDER_X509_CERT_URL}"
        FIREBASE_CLIENT_X509_CERT_URL = "${env.GITHUB_ENV.FIREBASE_CLIENT_X509_CERT_URL}"
        FIREBASE_UNIVERSE_DOMAIN = "${env.GITHUB_ENV.FIREBASE_UNIVERSE_DOMAIN}"
        FIREBASE_DATABASE_URL = "${env.GITHUB_ENV.FIREBASE_DATABASE_URL}"
        RAILWAY_SERVICE_NAME = "${env.GITHUB_ENV.RAILWAY_SERVICE_NAME}"
        RAILWAY_TOKEN = "${env.GITHUB_ENV.RAILWAY_TOKEN}"
        DOCKER_USERNAME = "${env.GITHUB_ENV.DOCKER_USERNAME}"
        DOCKER_PASSWORD = "${env.GITHUB_ENV.DOCKER_PASSWORD}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'jenkins-demo', url: 'https://github.com/ASE-UIT/congchungonline-be.git']])
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        // Use shell command for Unix-like systems
                        sh 'npm install'
                    } else {
                        // Use batch command for Windows systems
                        bat 'npm install'
                    }
                }
            }
        }

        // stage('Run Application') {
        //     steps {
        //         script {
        //             if (isUnix()) {
                        // sh "export PORT=${PORT} && export JWT_SECRET=${JWT_SECRET} && npm start"
        //             } else {
        //                 bat "set PORT=${PORT} && set JWT_SECRET=${JWT_SECRET} && npm start"
        //             }
        //         }
        //     }
        // }

        // stage('Run Tests') {
        //     steps {
        //         script {
        //             if (isUnix()) {
        //                 sh 'npm test'
        //             } else {
        //                 bat 'npm test'
        //             }
        //         }
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t congchungonline-be .'
                    } else {
                        bat 'docker build -t congchungonline-be .'
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker tag congchungonline-be ${env.GITHUB_ENV.DOCKER_USERNAME}/congchungonline-be'
                        sh 'docker push ${env.GITHUB_ENV.DOCKER_USERNAME}/congchungonline-be'
                    } else {
                        bat 'docker tag congchungonline-be %DOCKER_USERNAME%/congchungonline-be'
                        bat 'docker push %DOCKER_USERNAME%/congchungonline-be'
                    }
                }
            }
        }

        stage('Install Railway') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install -g @railway/cli'
                    } else {
                        bat 'npm install -g @railway/cli'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'railway up --service ${RAILWAY_SERVICE_NAME}'
                    } else {
                        bat 'railway up --service ${RAILWAY_SERVICE_NAME}'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                cleanWs()
            }
        }
    }
}