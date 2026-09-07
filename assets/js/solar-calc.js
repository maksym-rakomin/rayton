/* Calculation model ported from Base44 src/lib/solarCalc.js (September 2026).
   Keep coefficients and rounding aligned with the source; UI validation is separate. */
(function (root) {
  'use strict';
  var calcConfig = {
    costPerKw: 25000,
    generationPerKwByMonth: [60, 70, 90, 110, 130, 140, 140, 130, 110, 90, 65, 55],
    coverageFraction: 0.8,
    warrantyYears: 30,
    credit: { annualRate: 0.18, termMonths: 84 },
    downPayments: [0, 0.2]
  };
  function calculateSolarPayback(input) {
    var cfg = calcConfig;
    var effectiveTariff = input.tariff > 0 ? input.tariff : 4.32;
    var effectiveConsumption = input.monthlyCostUAH > 0 ? input.monthlyCostUAH / effectiveTariff : input.monthlyConsumptionKwh;
    var effectiveMonthlyCost = input.monthlyCostUAH > 0 ? input.monthlyCostUAH : effectiveConsumption * effectiveTariff;
    var annualGenPerKw = cfg.generationPerKwByMonth.reduce(function (a, b) { return a + b; }, 0);
    var powerKw = Math.round(effectiveConsumption * 12 * cfg.coverageFraction / annualGenPerKw * 2) / 2;
    var systemCost = powerKw * cfg.costPerKw;
    var monthlyData = cfg.generationPerKwByMonth.map(function (generation) {
      return Math.round(Math.min(generation * powerKw, effectiveConsumption) * effectiveTariff);
    });
    var annualSavings = monthlyData.reduce(function (a, b) { return a + b; }, 0);
    var avgMonthlySavings = Math.round(annualSavings / 12);
    var creditScenarios = cfg.downPayments.map(function (dpFrac) {
      var downPayment = systemCost * dpFrac;
      var principal = systemCost - downPayment;
      var r = cfg.credit.annualRate / 12;
      var monthlyPayment = r === 0 ? principal / cfg.credit.termMonths : principal * r / (1 - Math.pow(1 + r, -cfg.credit.termMonths));
      var totalPaid = downPayment + monthlyPayment * cfg.credit.termMonths;
      return { dpFrac: dpFrac, dpPercent: Math.round(dpFrac * 100), downPayment: downPayment, principal: principal,
        monthlyPayment: monthlyPayment, netMonthly: avgMonthlySavings - monthlyPayment, annualSavings: annualSavings,
        payback: annualSavings > 0 ? totalPaid / annualSavings : 0, profit30: annualSavings * cfg.warrantyYears - totalPaid };
    });
    return { powerKw: powerKw, systemCost: systemCost, avgMonthlySavings: avgMonthlySavings,
      annualSavings: annualSavings, paybackOwn: annualSavings > 0 ? systemCost / annualSavings : 0,
      profit30Own: annualSavings * cfg.warrantyYears - systemCost, monthlyData: monthlyData,
      creditScenarios: creditScenarios, effectiveConsumption: effectiveConsumption, effectiveTariff: effectiveTariff,
      effectiveMonthlyCost: effectiveMonthlyCost };
  }
  var api = { calcConfig: calcConfig, calculateSolarPayback: calculateSolarPayback };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RaytonSolar = api;
})(typeof window !== 'undefined' ? window : this);
