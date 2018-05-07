const defaults = require("../defaults.js");

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

module.exports = getUISchema;
