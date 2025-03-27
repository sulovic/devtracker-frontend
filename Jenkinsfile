pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM', 
                                  branches: [[name: '*/main']], 
                                  userRemoteConfigs: [[url: 'https://github.com/sulovic/devtracker-frontend.git']]])
      }
    }

  }
}