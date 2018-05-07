const defaults = require("../defaults.js");

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

module.exports = getDataSchema;
