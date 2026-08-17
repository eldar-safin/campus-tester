import type { Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

class ConsoleReporter implements Reporter {
  private readonly results = new Map<TestCase, TestResult['status']>();

  onBegin(_config: unknown, suite: Suite) {
    console.log(`Запуск тестов: ${suite.allTests().length}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.set(test, result.status);

    const icon = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '-' : '✘';
    const duration = (result.duration / 1000).toFixed(1);

    console.log(`  ${icon} ${test.title} (${duration} с)`);

    if (result.status !== 'passed' && result.status !== 'skipped') {
      for (const error of result.errors) {
        console.error(error.stack ?? error.message ?? 'Неизвестная ошибка');
      }
    }
  }

  onEnd() {
    const statuses = [...this.results.values()];
    const passed = statuses.filter((status) => status === 'passed').length;
    const skipped = statuses.filter((status) => status === 'skipped').length;
    const failed = statuses.length - passed - skipped;

    console.log(`\nПройдено тестов: ${passed}`);

    if (failed > 0) {
      console.log(`Тестов с ошибкой: ${failed}`);
    }

    if (skipped > 0) {
      console.log(`Пропущено тестов: ${skipped}`);
    }
  }
}

export default ConsoleReporter;
