import { defineConfig } from '@playwright/test';

const targetUrl = process.env.TARGET_URL;

if (!targetUrl) {
  throw new Error('Переменная TARGET_URL обязательна. Укажите её в файле .env проекта.');
}

let parsedTargetUrl: URL;

try {
  parsedTargetUrl = new URL(targetUrl);
} catch {
  throw new Error(`TARGET_URL должен быть корректным абсолютным URL. Получено: ${targetUrl}`);
}

if (!['http:', 'https:'].includes(parsedTargetUrl.protocol)) {
  throw new Error(`TARGET_URL должен использовать протокол HTTP или HTTPS. Получено: ${targetUrl}`);
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  workers: 1,
  reporter: 'list',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        baseURL: parsedTargetUrl.toString(),
      },
    },
  ],
});
