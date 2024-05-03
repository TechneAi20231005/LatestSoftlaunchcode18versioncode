import React from "react";

// Function to format an amount in Indian currency
function getIndianCurrency(amount) {
  const number = Math.abs(amount);
  const decimal = Math.round((number - Math.floor(number)) * 100);
  let hundred = null;
  let no = Math.floor(number);
  const digits_length = no.toString().length;
  let i = 0;

  const str = [];
  const words = {
    0: '',
    1: 'One',
    // ... (rest of the numbers and their words)
  };
  const digits = ['', 'Hundred', 'Thousand', 'Lakh', 'Crore', 'Billion'];

  while (i < digits_length) {
    const divider = i === 2 ? 10 : 100;
    const remainder = no % divider;
    no = Math.floor(no / divider);
    i += divider === 10 ? 1 : 2;

    if (remainder) {
      const plural = str.length && remainder > 9 ? 's' : null;
      hundred = str.length === 1 && str[0] ? ' And ' : null;

      if (remainder < 21) {
        str.push(`${words[remainder]} ${digits[str.length]}${plural} ${hundred}`);
      } else {
        str.push(`${words[Math.floor(remainder / 10) * 10]} ${words[remainder % 10]} ${digits[str.length]}${plural} ${hundred}`);
      }
    } else {
      str.push(null);
    }
  }

  const Rupees = str.reverse().join('');

  const paise = decimal ? `Point ${words[Math.floor(decimal / 10)]} ${words[decimal % 10]} Paise` : '';

  if (no === 0) {
    return 'Zero';
  }

  return (Rupees ? Rupees + ' Rupees ' : '') + paise;
}

// React component to display the formatted amount
function CurrencyConverter({ amount }) {
  const formattedAmount = getIndianCurrency(amount);

  return (
    <div>
      <p className="fw-bold" style={{color:"red", fontStyle:"italic"}}>{formattedAmount}</p>
    </div>
  );
}

export default CurrencyConverter;
