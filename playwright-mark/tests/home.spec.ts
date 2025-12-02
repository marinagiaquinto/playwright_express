import {test, expect} from '@playwright/test';

test('webapp deve estar online', async ({page}) => {
    await page.goto('http://localhost:3000');
});