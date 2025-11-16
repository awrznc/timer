// @ts-check

import { check, sleep } from 'k6';
import { browser } from 'k6/browser';

const HOST = 'server';
const URI = `http://${HOST}/`;

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate === 1.00'],
    browser_http_req_failed: ['rate <= 0.00']
  },
};

/**
 * @param {String} tag
 * @param {any} a
 * @param {any} b
 */
function checkEqual(tag, a, b) {
  let test = new Map();
  test.set(`${tag}: ${a} === ${b}`, () => a === b);
  check(null, Object.fromEntries(test));
}

/**
 * @param {String} tag
 * @param {any} a
 * @param {any} b
 */
function checkNotEqual(tag, a, b) {
  let test = new Map();
  test.set(`${tag}: ${a} != ${b}`, () => a != b);
  check(null, test);
}

/**
 * @param {String} tag
 * @param {any} page
 * @param {String} url
 * @param {((tag: String, page: any) => Promise<void>)[]} options
 */
async function test(tag, page, url, options) {
  const RESPONSE = await page.goto(url);
  checkEqual(`${tag}: page url`, await page.url(), url);
  checkEqual(`${tag}: page title`, await page.title(), 'timer');
  checkEqual(`${tag}: http response status code`, await RESPONSE.status(), 200);

  for (const OPTION of options) {
    await OPTION(tag, page);
  }
}

/**
 * @abstract entry point
 */
export default async function () {
  const CONTEXT = await browser.newContext();
  const PAGE = await CONTEXT.newPage();

  try {
    // simple check
    await test('simple check 1', PAGE, URI, []);
    await test('simple check 2', PAGE, `${URI}?tasks=00:00:01-Task1`, []);
    await test('simple check 3', PAGE, `${URI}?tasks=99:59:59-Task1`, []);
    await test('simple check 4', PAGE, `${URI}?tasks=99:99:99-Task1`, []);

    // check click
    const CLICK_URL = `${URI}?tasks=00:00:01-Task1,00:00:02-Task2,00:00:03-Task3`;
    await test('click', PAGE, CLICK_URL, [async (tag, page) => {

      // check before click
      const MAIN_TIME_TEXT = await page.locator('text#clock-time');
      checkEqual(`${tag}: main time text`, await MAIN_TIME_TEXT.textContent(), '00:00:06.00');
      const TASK_TIME_TEXT = await page.locator('text#clock-time-0');
      checkEqual(`${tag}: task time text`, await TASK_TIME_TEXT.textContent(), '00:00:01');

      // check after click
      const CLOCK_MAIN = await page.locator('div#clock-main');
      await Promise.all([CLOCK_MAIN.click()]);
      sleep(1.0);
      checkNotEqual(`${tag}: main time text`, await MAIN_TIME_TEXT.textContent(), '00:00:00.00');
      checkEqual(`${tag}: task time text`, await TASK_TIME_TEXT.textContent(), '00:00:00');
      sleep(0.8);
      await page.screenshot({ path: 'browser.png', omitBackground: true });
      sleep(1.2 + 3.0);
      checkEqual(`${tag}: main time text`, await MAIN_TIME_TEXT.textContent(), '00:00:00.00');
    }]);

    // check onload
    const ONLODA_URL = `${URI}?trigger=onload&tasks=00:00:01-Task1,00:00:02-Task2,00:00:03-Task3`;
    await test('onload', PAGE, ONLODA_URL, [async (tag, page) => {

      // check before click
      const MAIN_TIME_TEXT = await page.locator('text#clock-time');
      checkNotEqual(`${tag}: main time text`, await MAIN_TIME_TEXT.textContent(), '00:00:03.00');
      const TASK_TIME_TEXT = await page.locator('text#clock-time-0');
      checkNotEqual(`${tag}: task time text`, await TASK_TIME_TEXT.textContent(), '00:00:01');

      // check after click
      const CLOCK_MAIN = await page.locator('div#clock-main');
      await Promise.all([CLOCK_MAIN.click()]);
      sleep(1.0);
      checkNotEqual(`${tag}: main time text`, await MAIN_TIME_TEXT.textContent(), '00:00:00.00');
      checkEqual(`${tag}: task time text`, await TASK_TIME_TEXT.textContent(), '00:00:00');
      sleep(2.0 + 3.0);
      checkNotEqual(`${tag}: main time text`, await MAIN_TIME_TEXT.textContent(), '00:00:00.00');
    }]);
  } catch (error) {
    console.error(error);
  } finally {
    await PAGE.close();
    await CONTEXT.close();
  }
}
