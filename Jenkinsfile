pipeline {
    agent any

    environment {
        NPM_CONFIG_UPDATE_NOTIFIER = 'false'
    }

    stages {
        stage('Подготовка') {
            steps {
                script {
                    def targetUrl = env.DEFAULT_TARGET_URL?.trim()

                    if (!targetUrl) {
                        targetUrl = input(
                            message: 'Укажите адрес сайта для тестирования',
                            ok: 'Продолжить',
                            parameters: [
                                string(
                                    name: 'TARGET_URL',
                                    defaultValue: '',
                                    description: 'Абсолютный URL с протоколом HTTP или HTTPS'
                                )
                            ]
                        )
                    }

                    if (!targetUrl?.trim()) {
                        error('Адрес сайта не указан.')
                    }

                    env.RESOLVED_TARGET_URL = targetUrl.trim()
                }
            }
        }

        stage('Проверка доступности') {
            steps {
                script {
                    docker.image('mcr.microsoft.com/playwright:v1.62.1-noble').inside(
                        '--ipc=host --user 1000:1000'
                    ) {
                        dir('playwright') {
                            sh 'npm ci --no-audit --no-fund > /dev/null'

                            withEnv(["TARGET_URL=${env.RESOLVED_TARGET_URL}"]) {
                                sh 'npm test'
                            }
                        }
                    }
                }
            }
        }
    }
}
