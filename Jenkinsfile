pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Install Yarn') {
            steps {
                script {
                    bat 'npm install -g yarn'
                }
            }
        }

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
                    bat 'yarn install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    bat 'yarn test'
                }
            }
        }

        stage('Run Application') {
            steps {
                script {
                    bat 'yarn start'
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
