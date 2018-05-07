/*
 * MIT License
 *
 * Copyright (c) [year] [fullname]
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const prompt = require("prompt");
const colors = require("colors/safe");
const optimist = require("optimist");

const showResult = require("./output/showResult");
const getUISchema = require("./input/input-schema/ui.js");
const getDataSchema = require("./input/input-schema/data.js");

// For programmatic use, such as from the automated test, instead of manually inputting everything on the command-line.
prompt.override = optimist.argv;

const KILO = 1000;

prompt.message = colors.yellow("");

prompt.start();
prompt.get(getUISchema(), function(err, uiResult) {
  const ds = getDataSchema(uiResult.cryptoName, uiResult.nonCryptoCurrency);
  prompt.get(ds, function(err, dataResult) {
    const operatingProfitLoss = getOperatingProfitLoss(dataResult);
    showResult(operatingProfitLoss, uiResult, dataResult.totalHrs);
  });
});

// - - -

function getOperatingProfitLoss(dataResult) {
  const {
    costPerKwh,
    wattsConsumption,
    cryptoPayout,
    cryptoPriceUSD,
    totalHrs
  } = dataResult;
  const powerCostPerHour = wattsConsumption / KILO * costPerKwh;
  const cryptoValue = cryptoPayout * cryptoPriceUSD;
  const totalPowerCost = powerCostPerHour * totalHrs;
  return cryptoValue - totalPowerCost;
}
