pipeline {
    agent any

    tools {nodejs "nodejs"}

    environment {
        NODE_ENV = 'development'
        PORT = 3100
        HOST = "${env.HOST}"
        MONGODB_URL = "${env.MONGODB_URL}"
        JWT_SECRET = "${env.JWT_SECRET}"
        JWT_ACCESS_EXPIRATION_MINUTES = 30
        JWT_REFRESH_EXPIRATION_DAYS = 30
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES = 10
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = 10
        SMTP_HOST = "${env.SMTP_HOST}"
        SMTP_PORT = 587
        SMTP_USERNAME = "${env.SMTP_USERNAME}"
        SMTP_PASSWORD = "${env.SMTP_PASSWORD}"
        EMAIL_FROM = "${env.EMAIL_FROM}"
        GOOGLE_CLIENT_ID = "${env.GOOGLE_CLIENT_ID}"
        GOOGLE_CLIENT_SECRET = "${env.GOOGLE_CLIENT_SECRET}"
        GOOGLE_CALLBACK_URL = "${env.GOOGLE_CALLBACK_URL}"
        GEMINI_API_KEY = "${env.GEMINI_API_KEY}"
        FIREBASE_TYPE = "${env.FIREBASE_TYPE}"
        FIREBASE_PROJECT_ID = "${env.FIREBASE_PROJECT_ID}"
        FIREBASE_STORAGE_BUCKET = "${env.FIREBASE_STORAGE_BUCKET}"
        FIREBASE_PRIVATE_KEY_ID = "${env.FIREBASE_PRIVATE_KEY_ID}"
        FIREBASE_PRIVATE_KEY = "${env.FIREBASE_PRIVATE_KEY_JENKINS}"
        FIREBASE_CLIENT_EMAIL = "${env.FIREBASE_CLIENT_EMAIL}"
        FIREBASE_CLIENT_ID = "${env.FIREBASE_CLIENT_ID}"
        FIREBASE_AUTH_URI = "${env.FIREBASE_AUTH_URI}"
        FIREBASE_TOKEN_URI = "${env.FIREBASE_TOKEN_URI}"
        FIREBASE_AUTH_PROVIDER_X509_CERT_URL = "${env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL}"
        FIREBASE_CLIENT_X509_CERT_URL = "${env.FIREBASE_CLIENT_X509_CERT_URL}"
        FIREBASE_UNIVERSE_DOMAIN = "${env.FIREBASE_UNIVERSE_DOMAIN}"
        FIREBASE_DATABASE_URL = "${env.FIREBASE_DATABASE_URL}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/ASE-UIT/congchungonline-be.git'
                        ]]
                    ])
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

        stage('Run Application') {
            steps {
                script {
                    if (isUnix()) {
                        sh "export PORT=${PORT} && export JWT_SECRET=${JWT_SECRET} && npm start"
                    } else {
                        bat "set PORT=${PORT} && set JWT_SECRET=${JWT_SECRET} && npm start"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
