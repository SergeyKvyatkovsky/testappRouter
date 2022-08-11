@Library(['piper-lib','piper-lib-os' ]) _

def CF_ORG = ''
def SPACE = ''
def VARIABLES_FILES = ''

pipeline {
  environment {
    GIT_REPO = 'https://github.wdf.sap.corp/learninghub/certifications-approuter'
    BRANCH_NAME = 'test'
    CF_TARGET = 'https://api.cf.eu10.hana.ondemand.com'
    GIT_CREDENTIALSID = '6964388e-609e-41d0-8b3b-8a1828bf1fe3'
    CF_DEPLOY_CREDENTIALSID = 'a0d3bb11-f6c6-4d3c-adc5-8503e95e6ff3'
  }

  agent any

  stages {
    stage('Prepare') {
      steps {
        deleteDir()
        checkout scm
        setupCommonPipelineEnvironment script: this
        setupPipelineEnvironment script: this
        echo  env.GIT_BRANCH
      }
    }

 		stage('Parallel Tasks') {
  		parallel {
    		stage('Task 1') {
        	stages {
          	stage('Whitesource Checks') {
            	steps {
              	catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                	whitesourceExecuteScan script: this
              	}
            	}
          	}
        	}
      	}
        stage('Task 2') {
          stages {
            stage('Сheckmarx Checks') {
              steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                  checkmarxExecuteScan script: this
                }
              }
            }
          }
        }
     		stage('Task 2 - Deploy') {
     			stages {
    				stage('Install Dependencies') {
      				steps {
        				nodejs('nodejs10') {
          				// some block
          				// sh 'npm config set @sap:registry https://npm.sap.com'
          				// sh 'cd approuter'
          				// sh 'npm install --quite'
              
        				}
      				}
    				}
    				stage ('Proceed for Development') {
       				when { 
        				expression { env.GIT_BRANCH == 'develop' }
       				}
        			steps { 
						echo '======================='
						echo 'Start copy develop config file'
						sh 'cp -p -v resources/dev/xs-app.json approuter'
						sh 'cp -p -v resources/dev/xs-security.json .'
						sh 'ls -a'
						sh 'cat approuter/xs-app.json'
						sh 'cat xs-security.json'
       				//input('Do you want to proceed?') 
          			//nodejs('nodejs10') {
          			//sh 'ng build --configuration=\"development\"'
          			//}
          			script {
               		VARIABLES_FILES = ['vars_DEV.yml']
            			CF_ORG= "learininghub3_dev"
            			SPACE =  "stay_current"
          			}     
        			}
    				}
    				stage ('Proceed for Test') {
       				when { 
        				expression { env.GIT_BRANCH == 'test' }
       				}
        			steps {
						echo '======================='
						echo 'Start copy test config file'
						sh 'cp -p -v resources/test/xs-app.json approuter'
						sh 'cp -p -v resources/test/xs-security.json .'
						sh 'cat approuter/xs-app.json'
						sh 'cat xs-security.json'
        				//input('Do you want to proceed the deployment to Test?') 
        				//nodejs('nodejs10') {
        				//sh 'ng build --configuration=\"development\"'
        				//}
          			script {
            			VARIABLES_FILES = ['vars_TEST.yml']
            			CF_ORG= "learninghub3_test"
            			SPACE =  "stay_current"
          			}
        			}
    				}
    				stage ('Proceed for Production') {
       				when { 
        				expression { env.GIT_BRANCH == 'master' }
       				}
        			steps { 
         				input('Do you want to proceed the deployment to Production?')
						echo '======================='
						echo 'Start copy master config file'
						sh 'cp -p -v resources/prod/xs-app.json approuter'
						sh 'cp -p -v resources/prod/xs-security.json .'
						sh 'cat approuter/xs-app.json'
						sh 'cat xs-security.json'
          			//nodejs('nodejs10') {
          			//sh 'ng build --prod'
          			//}
          			script {
            			VARIABLES_FILES = ['vars_PROD.yml']
            			CF_ORG= "learninghub3_prod"
            			SPACE =  "stay_current"
          			}
        			}
    				}
      			stage ('Deploy') {
        			when {
        				anyOf {
            			branch 'master';
            			branch 'test';
             			branch 'develop'
             			branch 'piper'
          			}
        			}
        			steps { 
        				//pushToCloudFoundry cloudSpace: SPACE, credentialsId: env.CF_DEPLOY_CREDENTIALSID, manifestChoice: [manifestFile: MANIFEST], organization: CF_ORG, target: env.CF_TARGET
        				cloudFoundryDeploy(
          				script: this,
          				//deployType: 'blue-green',
          				cloudFoundry: [ apiEndpoint: env.CF_TARGET ,manifestVariablesFiles: VARIABLES_FILES  ,credentialsId: env.CF_DEPLOY_CREDENTIALSID, manifest: 'manifest.yml', org: CF_ORG, space: SPACE,],
          				deployTool: 'cf_native'
        				)
        			}		
      			}
   				}
   			}
  		}
 		}
	}
}
