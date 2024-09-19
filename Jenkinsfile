pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
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
        //             bat 'npm test'
        //         }
        //     }
        // }

        stage('Run Application') {
            steps {
                script {
                    bat 'npm start'
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
