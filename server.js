const express = require('express');
const cors = require('cors');

const app = express().use(cors(), express.json(), (_, __, next) =>
  setTimeout(next, 1000),
);

const calculateCurrentRate = () => (1 + Math.random() * 0.1).toFixed(2);

const throwError = (message) => {
  throw new Error(message);
};

app.post('/api/generate-rate-quote', (req, res) => {
  const { receivedAmount, sentAmount } = req.body ?? {};

  !+receivedAmount && !+sentAmount && throwError('Incorrect data provided');

  const rate = calculateCurrentRate();

  res.jsonp({
    sentAmount:
      sentAmount ?? String((Number(receivedAmount) / rate).toFixed(2)),
    receivedAmount:
      receivedAmount ?? String((Number(sentAmount) * rate).toFixed(2)),
    rate,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
  });
});

app.listen(5000);
