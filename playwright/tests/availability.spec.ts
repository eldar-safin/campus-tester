import { expect, test } from '@playwright/test';

const targetUrl = process.env.TARGET_URL;

test(`сайт ${targetUrl} доступен`, async ({ baseURL, page }) => {
  if (!baseURL) {
    throw new Error('Адрес проверяемого сайта (baseURL) не настроен.');
  }

  const response = await page.goto(baseURL);

  if (!response) {
    throw new Error(`Переход на ${baseURL} не вернул HTTP-ответ.`);
  }

  expect(
    response.ok(),
    `Ожидался успешный ответ от ${baseURL}, получено: ${response.status()} ${response.statusText()}.`,
  ).toBe(true);
});
