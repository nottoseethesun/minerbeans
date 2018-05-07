const colors = require("colors/safe");

function showResult(operatingProfitLoss, uiResult, totalHrs) {
    const { nonCryptoCurrency, cryptoName } = uiResult;
    const iconMsg = getIconMsg(operatingProfitLoss);
    const msg = `Operating profit/loss for mining ${cryptoName} is ${nonCryptoCurrency} ${operatingProfitLoss} per ${
      totalHrs
    } hours.`;
    console.info(iconMsg + " " + colors.magenta(msg) + " " + iconMsg);
  }

function getIconMsg(operatingProfitLoss) {
  const profitable = operatingProfitLoss > 0;
  const icon = profitable ? "🎉" : "☂";
  const iconText = `  ${icon}   `;
  const iconColor = profitable ? "black" : "red";
  const iconBackgroundColor = profitable ? "bgGreen" : "bgWhite";
  return colors[iconBackgroundColor][iconColor].bold(iconText);
}

module.exports = showResult;
