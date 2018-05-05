#!/bin/bash

output=`node index.js --cryptoName Monero --nonCryptoCurrency '$USD' --costPerKwh 0.18 --wattsConsumption 30 --cryptoPayout 0.0005818376 --cryptoPriceUSD 280 --totalHrs 24`
actual=$output # $(echo "$output" | tr -d '\r\n')

# Must remove single quotes from actual output.
read -r -d '' expected <<'EOF'
Metrics Input is:
{ costPerKwh: 0.18,
  wattsConsumption: 30,
  cryptoPayout: 0.0005818376,
  cryptoPriceUSD: 280,
  totalHrs: 24 }
Operating profit/loss for mining Monero is $USD 0.03331452800000001 per 24 hours.
EOF
processedExp=$expected #$(echo "$expected" | tr -d '\r\n')

if [ "${#actual}l" == "${#expected}" ]
then
  echo Unequal output
  exit 1
fi
exit 0
