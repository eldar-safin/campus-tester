# Campus Tester

Локальная система запуска браузерных тестов публичного сайта через Jenkins.

На текущем этапе реализована проверка доступности сайта в Chromium. Jenkins загружает `Jenkinsfile` из Git-репозитория и запускает Playwright в официальном Docker-образе.

## Требования

- Git;
- Docker с поддержкой Docker Compose;
- свободный порт `8080`.

## Запуск

```bash
git clone https://github.com/eldar-safin/campus-tester.git
cd campus-tester
docker compose up -d --build
```

По умолчанию адрес сайта не задан: Jenkins запросит его перед запуском теста. Чтобы задать адрес заранее, создайте локальный `.env`:

```bash
cp .env.example .env
```

Укажите в нём абсолютный HTTP- или HTTPS-адрес:

```dotenv
TARGET_URL=https://example.ru
```

Файл `.env` исключён из Git.

## Первоначальная настройка Jenkins

Откройте [http://localhost:8080](http://localhost:8080). При первом запуске получите начальный пароль командой:

```bash
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Завершите мастер настройки и создайте администратора. Необходимые плагины уже устанавливаются из `jenkins/plugins.txt` при сборке образа.

Данные Jenkins находятся в именованном Docker volume и сохраняются после перезапуска или `docker compose down`. Повторная первоначальная настройка потребуется только после удаления этого volume.

## Создание Pipeline

На текущем этапе задание Jenkins создаётся вручную:

1. Выберите **Создать Item** → **Pipeline**.
2. В поле **Definition** выберите **Pipeline script from SCM**.
3. Выберите **Git** и укажите репозиторий:

   ```text
   https://github.com/eldar-safin/campus-tester.git
   ```

4. Для стабильной версии задайте **Branch Specifier**:

   ```text
   refs/heads/main
   ```

   Для разработки используйте `refs/heads/dev`.

5. Оставьте **Script Path** равным `Jenkinsfile`, сохраните задание и нажмите **Собрать сейчас**.

Если `TARGET_URL` не задан в `.env`, Pipeline остановится на стадии **Подготовка** и запросит адрес сайта.

## Ручной запуск Playwright

При заполненном `TARGET_URL` в `.env` тест можно запустить без Jenkins:

```bash
docker compose --profile tests run --rm playwright
```

## Остановка

```bash
docker compose down
```

Эта команда не удаляет данные Jenkins.

## Безопасность

- не добавляйте `.env`, пароли и другие секреты в Git;
- Jenkins имеет доступ к Docker socket и фактически может управлять Docker на хосте;
- запускайте только доверенный `Jenkinsfile` и не публикуйте этот Jenkins в Интернет без отдельной настройки безопасности.

## Текущие ограничения

- создание администратора и Pipeline пока не автоматизировано;
- используется только Chromium;
- реализована только проверка доступности сайта.
