pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        PORT = "${env.PORT}"
        MONGODB_URL = "${env.MONGODB_URL}"
        JWT_SECRET = "${env.JWT_SECRET}"
        GEMINI_API_KEY = "${env.GEMINI_API_KEY}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/FiveD-SE/congchungonline-be.git',
                            credentialsId: 'jenkins-github-sloweyyy'
                        ]]
                    ])
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm install'
                }
            }
        }

        // stage('Run Tests') {
        //     steps {
        //         script {
        //             bat "set MONGODB_URL=${MONGODB_URL} && npm test"
        //         }
        //     }
        // }

        stage('Run Application') {
            steps {
                script {
                    bat "set PORT=${PORT} && set JWT_SECRET=${JWT_SECRET} && npm start"
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
