@Library('sharedlibrary')_

pipeline {
    agent {
        label 'agent'
    }
    environment {
        ecrRegistry = "070797855002.dkr.ecr.ap-south-1.amazonaws.com"
        imageName = "${ecrRegistry}/marketplace-risk-frontend"
        branchName = sh(script: 'echo $BRANCH_NAME | sed "s#/#-#"', returnStdout: true).trim()
        gitCommit = "${GIT_COMMIT ? GIT_COMMIT[0..6] : 'local'}"
        dockerTag = "${branchName}-${gitCommit}-${env.BUILD_NUMBER}"
        gitRepoURL = "https://github.com/nagaraj602/marketplace-risk-frontend.git"
        awsRegion = "ap-south-1"
        eksCluster = "marketplace-risk-platform-eks"
    }
    stages {
        stage('Git Checkout') {
            steps {
                gitCheckout(env.gitRepoURL, env.BRANCH_NAME, "githubCred")
            }
        }

        stage('Docker Build') {
            steps {
                dockerImageBuild(env.imageName, env.dockerTag, 'Dockerfile')
            }
        }

        stage('Docker Push ECR') {
            steps {
                dockerECRImagePush(env.imageName, env.dockerTag, env.awsRegion, 'marketplace-risk-frontend', 'awsCred')
            }
        }

        stage('Update Helm Values') {
            steps {
                dir('helm') {
                    sh """
                        sed -i 's|__FRONTEND_IMAGE_REPOSITORY__|${env.imageName}|g' values.yaml
                        sed -i 's|__FRONTEND_IMAGE_TAG__|${env.dockerTag}|g' values.yaml
                    """
                }
            }
        }

        stage('Kubernetes Deploy - DEV') {
            when { branch 'dev' }
            steps {
                kubernetesEKSHelmDeployEnv(env.imageName, env.dockerTag, 'marketplace-risk-frontend', 'awsCred', env.awsRegion, env.eksCluster, 'dev')
            }
        }

        stage('Kubernetes Deploy - STAGING / UAT') {
            when { branch 'staging' }
            steps {
                kubernetesEKSHelmDeployEnv(env.imageName, env.dockerTag, 'marketplace-risk-frontend', 'awsCred', env.awsRegion, env.eksCluster, 'uat')
            }
        }

        stage('Kubernetes Deploy - PROD') {
            when { anyOf { branch 'master'; branch 'main' } }
            steps {
                input message: "Approve production deployment for ${env.imageName}:${env.dockerTag}?", ok: "Deploy to Prod"
                kubernetesEKSHelmDeployEnv(env.imageName, env.dockerTag, 'marketplace-risk-frontend', 'awsCred', env.awsRegion, env.eksCluster, 'prod')
            }
        }
    }
}
