'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const calculatorPages = ['index.html', 'financing.html', 'ses.html', 'calculator.html'];

test('every calculator instance supports both calculation variants', () => {
  for (const page of calculatorPages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const forms = html.match(/<form class="calc__card"[\s\S]*?<\/form>/g) || [];

    assert.equal(forms.length, 2, `${page} must contain both calculator forms`);
    assert.match(forms[0], /action="calculator\.html"/);
    assert.match(forms[0], /name="monthlyConsumptionKwh"/);
    assert.match(forms[0], /name="tariff"/);
    assert.match(forms[1], /action="calculator\.html"/);
    assert.match(forms[1], /name="monthlyCostUAH"/);
    assert.match(html, /assets\/js\/solar-calc\.js/);
    assert.match(html, /assets\/js\/calculator\.js/);
  }
});
