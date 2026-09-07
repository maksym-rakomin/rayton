'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateSolarPayback: calculate, calcConfig } = require('../assets/js/solar-calc.js');

test('Base44 reference fixture: 5000 kWh at 4.32 UAH, including seasonal consumption cap', () => {
  const r = calculate({ monthlyConsumptionKwh: 5000, tariff: 4.32 });
  assert.equal(r.powerKw, 40.5);
  assert.equal(r.systemCost, 1012500);
  assert.deepEqual(r.monthlyData, [10498, 12247, 15746, 19246, 21600, 21600, 21600, 21600, 19246, 15746, 11372, 9623]);
  assert.equal(r.annualSavings, 200124);
  assert.equal(r.avgMonthlySavings, 16677);
  assert.equal(r.profit30Own, 4991220);
  assert.ok(Math.abs(r.creditScenarios[0].monthlyPayment - 21280.560954990335) < 1e-8);
  assert.ok(Math.abs(r.creditScenarios[1].monthlyPayment - 17024.448763992266) < 1e-8);
  assert.equal(r.creditScenarios[1].downPayment, 202500);
  assert.ok(r.creditScenarios[0].netMonthly < 0);
});
test('bill and consumption variants give identical outputs for the same inputs', () => {
  for (const consumption of [100, 5000, 25000, 1000000]) {
    const { effectiveConsumption: a, ...byConsumption } = calculate({ monthlyConsumptionKwh: consumption, tariff: 4.32 });
    const { effectiveConsumption: b, ...byBill } = calculate({ monthlyCostUAH: consumption * 4.32 });
    assert.ok(Math.abs(a - b) < 1e-8);
    assert.deepEqual(byConsumption, byBill);
  }
});
test('credit total includes deposit once and amortizes the balance over 84 months', () => {
  const r = calculate({ monthlyCostUAH: 25000 });
  for (const c of r.creditScenarios) {
    let balance = c.principal;
    for (let m = 0; m < calcConfig.credit.termMonths; m++) balance = balance * (1 + calcConfig.credit.annualRate / 12) - c.monthlyPayment;
    assert.ok(Math.abs(balance) < 1e-6);
    assert.equal(c.profit30, r.annualSavings * 30 - (c.downPayment + c.monthlyPayment * 84));
  }
});
test('sub-panel inputs produce zero, so UI can reject instead of showing false payback', () => {
  const r = calculate({ monthlyConsumptionKwh: 1, tariff: 4.32 });
  assert.equal(r.powerKw, 0);
  assert.equal(r.annualSavings, 0);
});
