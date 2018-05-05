const prompt = require('prompt');
const colors = require("colors/safe");
const optimist = require('optimist')

prompt.override = optimist.argv

const KILO = 1000;

const defaults = {
  costPerKwh: 0.18,
  cryptoName: 'Monero',
  cryptoPayout: 0.0005818376,
  cryptoPriceUSD: 280,
  nonCryptoCurrency: '$USD',
  totalHrs: 24,
  wattsConsumption: 30
};

prompt.message = colors.yellow("Please enter: ");

prompt.start();
prompt.get(getUISchema(), function (err, uiResult) {
  const ds = getDataSchema(uiResult.cryptoName, uiResult.nonCryptoCurrency);
  prompt.get(ds, function (err, dataResult) {
    const {nonCryptoCurrency, cryptoName} = uiResult;
    const operatingProfitLoss = getOperatingProfitLoss(dataResult);
    console.info(colors.magenta(`Operating profit/loss for mining ${cryptoName} is ${nonCryptoCurrency} ${operatingProfitLoss} per ${dataResult.totalHrs} hours.`));
  });
});

// - - -

function getOperatingProfitLoss(dataResult) {
  const {costPerKwh, wattsConsumption, cryptoPayout, cryptoPriceUSD, totalHrs} = dataResult;
  const powerCostPerHour = (wattsConsumption / KILO) * costPerKwh
  const cryptoValue = cryptoPayout * cryptoPriceUSD;
  const totalPowerCost = powerCostPerHour * totalHrs;

  return (cryptoValue - totalPowerCost);
}

function getUISchema() {
  const {cryptoName, nonCryptoCurrency} = defaults;
  const schema = {
    properties: {
      cryptoName: {
        type: 'string',
        description: 'Crypto currency name: ',
        default: cryptoName,
        required: true
      },
      nonCryptoCurrency: {
        type: 'string',
        description: 'Non-crypto currency name: ',
        default: nonCryptoCurrency,
        required: true
      }
    }
  };
  return schema;
}

function getDataSchema(cryptoName, nonCryptoCurrency) {
  const numPattern = /^\d+(\.*\d+)?/;
  const {costPerKwh, wattsConsumption, cryptoPayout, cryptoPriceUSD, totalHrs} = defaults;
  const schema = {
    properties: {
      costPerKwh: {
        pattern: numPattern,
        description: 'Cost per kWh (same voltage as consumption), in ${nonCryptoCurrency}: ',
        default: costPerKwh,
        required: true
      },
      wattsConsumption: {
        pattern: numPattern,
        description: 'Watts consumption per hour (same voltage as cost per kWh): ',
        default: wattsConsumption,
        required: true
      },
      cryptoPayout: {
        pattern: numPattern,
        description: `Crypto payout per 24 hours, in ${cryptoName} units: `,
        default: cryptoPayout,
        required: true
      },
      cryptoPriceUSD: {
        pattern: numPattern,
        description: `Crypto price per unit in ${nonCryptoCurrency}: `,
        default: cryptoPriceUSD,
        required: true
      },
      totalHrs: {
        pattern: numPattern,
        description: 'Total hours spent mining: ',
        default: totalHrs,
        required: true
      }
    }
  }
  return schema;
};
