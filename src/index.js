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

prompt.override = optimist.argv;

const KILO = 1000;

const defaults = {
  costPerKwh: 0.18,
  cryptoName: "Monero",
  cryptoPayout: 0.0005818376,
  cryptoPriceUSD: 280,
  nonCryptoCurrency: "$USD",
  totalHrs: 24,
  wattsConsumption: 30
};

prompt.message = colors.yellow("");

prompt.start();
prompt.get(getUISchema(), function(err, uiResult) {
  const ds = getDataSchema(uiResult.cryptoName, uiResult.nonCryptoCurrency);
  prompt.get(ds, function(err, dataResult) {
    const { nonCryptoCurrency, cryptoName } = uiResult;
    const operatingProfitLoss = getOperatingProfitLoss(dataResult);
    const iconMsg = getIconMsg(operatingProfitLoss);
    const msg = `Operating profit/loss for mining ${cryptoName} is ${nonCryptoCurrency} ${operatingProfitLoss} per ${
      dataResult.totalHrs
    } hours.`;
    console.info(iconMsg + " " + colors.magenta(msg) + " " + iconMsg);
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

function getIconMsg(operatingProfitLoss) {
  const profitable = operatingProfitLoss > 0;
  const icon = profitable ? "🎉" : "☂";
  const iconText = `  ${icon}   `;
  const iconColor = profitable ? "black" : "red";
  const iconBackgroundColor = profitable ? "bgGreen" : "bgWhite";
  return colors[iconBackgroundColor][iconColor].bold(iconText);
}

function getUISchema() {
  const { cryptoName, nonCryptoCurrency } = defaults;
  const schema = {
    properties: {
      cryptoName: {
        type: "string",
        description: "Crypto currency name",
        default: cryptoName,
        required: true
      },
      nonCryptoCurrency: {
        type: "string",
        description: "Non-crypto currency name",
        default: nonCryptoCurrency,
        required: true
      }
    }
  };
  return schema;
}

function getDataSchema(cryptoName, nonCryptoCurrency) {
  const numPattern = /^\d+(\.*\d+)?/;
  const {
    costPerKwh,
    wattsConsumption,
    cryptoPayout,
    cryptoPriceUSD,
    totalHrs
  } = defaults;
  const schema = {
    properties: {
      costPerKwh: {
        pattern: numPattern,
        description: `Cost per kWh (same voltage as consumption), in ${nonCryptoCurrency}`,
        default: costPerKwh,
        required: true
      },
      wattsConsumption: {
        pattern: numPattern,
        description:
          "Watts consumption per hour (same voltage as cost per kWh)",
        default: wattsConsumption,
        required: true
      },
      cryptoPayout: {
        pattern: numPattern,
        description: `Total crypto payout received, in ${cryptoName} units`,
        default: cryptoPayout,
        required: true
      },
      cryptoPriceUSD: {
        pattern: numPattern,
        description: `${cryptoName} price per unit in ${nonCryptoCurrency}`,
        default: cryptoPriceUSD,
        required: true
      },
      totalHrs: {
        pattern: numPattern,
        description: "Total hours spent mining to get the payout received",
        default: totalHrs,
        required: true
      }
    }
  };
  return schema;
}
