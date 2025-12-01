const crypto = require('crypto');

module.exports = {
  // Generate unique ticket numbers (avoid Math.random for fairness)
  generateTicketNumbers: (start, count) => {
    const numbers = [];
    for (let i = 0; i < count; i++) {
      let num;
      do {
        num = crypto.randomInt(start, start + 10000); // Adjust range
      } while (numbers.includes(num));
      numbers.push(num);
    }
    return numbers;
  },

  // Pick winner from sold tickets
  pickWinner: (totalSold) => {
    return crypto.randomInt(1, totalSold);
  }
};