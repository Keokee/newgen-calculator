const aduCalculator = document.getElementById('adu-calculator');
const inputRangeArr = aduCalculator.querySelectorAll('input[type=range]');
const output = aduCalculator.querySelector('.output h2')

const [attached, detatched, ...rest] = inputRangeArr;

const range = 0;

const sqftPrices = {
  'attached': {
    0: 450,
    999: NaN
  },
  'detached': {
    0: 500,
    999: NaN
  }
}

// Returns the value of the highest matching sqft cost
const getSqftPrice = (name, value) => {
  const keys = Object.keys( sqftPrices[name] ).sort();

  while (keys.length > 0) {
    const key = keys.pop();
    if (key <= value) return sqftPrices[name][key];
  }
}

const generateRangeString = total => {
  if (range === 0) return '$'+total

  // Output the total +- the range, but don't let the lowest number fall below 0, if total is NaN output text
  return `$${total - range < 0 ? 0 : total - range} - $${total + range}`
}

const calculateEstimate = () => {
  // Create array of totals for each input
  const totals = Array.from(inputRangeArr)
    .map(input => {
      const value = parseInt(input.value);
      const pricingKey = input.dataset.key;

      return value * getSqftPrice(pricingKey, value);
    })

  // Add all totals in array together
  const total = totals.reduce( (accum, item) => accum + item );

  output.innerText = !isNaN(total) ? generateRangeString(total) : 'Please call for a quote.';
}

// Add event listener to each range input to run calculator in input event
inputRangeArr.forEach( input => {
  input.value = 0;
  input.addEventListener('input', calculateEstimate);
});

// Keep all range and number inputs synced
inputRangeArr.forEach( element => {
  // Set the number input field to match the range input field on load
  element.nextElementSibling.value = element.value;

  // Number input: if the range input is changed, set the number input to the same value
  element.addEventListener('input', event => {
    element.nextElementSibling.value = element.value;
  })

  // Range input: if the number input is changed, set the range input to the same value
  element.nextElementSibling.addEventListener('input', event => {
    element.value = event.target.value;

    // Dispatch event on the range input to run calculator
    element.dispatchEvent(new Event('input'));
  })
})